import { SupplierReturn } from './supplier-return';
import { SupplierReturnStatus } from '../enums/supplier-return-status.enum';
import { ReturnReason } from '../enums/return-reason.enum';
import { InvalidReturnTransitionException } from '../errors/invalid-return-transition.exception';
import { EmptyReturnItemsException } from '../errors/empty-return-items.exception';
import { DuplicateSlabInReturnException } from '../errors/duplicate-slab-in-return.exception';
import { SupplierReturnCreditedEvent } from '../events/supplier-return-credited.event';

const makeReturn = () =>
  SupplierReturn.create(
    'invoice-id',
    'supplier-id',
    new Date('2026-02-24'),
    'Test return',
    'user-1',
  );

describe('SupplierReturn entity', () => {
  describe('create', () => {
    it('should create with DRAFT status and zero creditAmount', () => {
      const ret = makeReturn();
      expect(ret.status).toBe(SupplierReturnStatus.DRAFT);
      expect(ret.creditAmount).toBe(0);
      expect(ret.items).toHaveLength(0);
    });

    it('should emit SupplierReturnCreatedEvent', () => {
      const ret = makeReturn();
      const events = ret.getUncommittedEvents();
      expect(events).toHaveLength(1);
    });
  });

  describe('addItem', () => {
    it('should add item and recalculate creditAmount', () => {
      const ret = makeReturn();
      ret.addItem(
        'slab-1',
        'bundle-1',
        ReturnReason.DEFECTIVE,
        '',
        150,
        'user-1',
      );
      expect(ret.items).toHaveLength(1);
      expect(ret.creditAmount).toBe(150);
    });

    it('should throw DuplicateSlabInReturnException for duplicate slab', () => {
      const ret = makeReturn();
      ret.addItem(
        'slab-1',
        'bundle-1',
        ReturnReason.DEFECTIVE,
        '',
        150,
        'user-1',
      );
      expect(() =>
        ret.addItem(
          'slab-1',
          'bundle-1',
          ReturnReason.BROKEN,
          '',
          100,
          'user-1',
        ),
      ).toThrow(DuplicateSlabInReturnException);
    });
  });

  describe('removeItem', () => {
    it('should remove item and recalculate creditAmount', () => {
      const ret = makeReturn();
      ret.addItem(
        'slab-1',
        'bundle-1',
        ReturnReason.DEFECTIVE,
        '',
        150,
        'user-1',
      );
      const itemId = ret.items[0].id.getValue();
      ret.removeItem(itemId, 'user-1');
      expect(ret.items).toHaveLength(0);
      expect(ret.creditAmount).toBe(0);
    });
  });

  describe('send', () => {
    it('should transition DRAFT → SENT', () => {
      const ret = makeReturn();
      ret.addItem(
        'slab-1',
        'bundle-1',
        ReturnReason.DEFECTIVE,
        '',
        150,
        'user-1',
      );
      ret.send('user-1');
      expect(ret.status).toBe(SupplierReturnStatus.SENT);
    });

    it('should throw EmptyReturnItemsException when no items', () => {
      const ret = makeReturn();
      expect(() => ret.send('user-1')).toThrow(EmptyReturnItemsException);
    });

    it('should throw InvalidReturnTransitionException when not DRAFT', () => {
      const ret = makeReturn();
      ret.addItem(
        'slab-1',
        'bundle-1',
        ReturnReason.DEFECTIVE,
        '',
        150,
        'user-1',
      );
      ret.send('user-1');
      expect(() => ret.send('user-1')).toThrow(
        InvalidReturnTransitionException,
      );
    });
  });

  describe('credit', () => {
    it('should transition SENT → CREDITED and emit SupplierReturnCreditedEvent', () => {
      const ret = makeReturn();
      ret.addItem(
        'slab-1',
        'bundle-1',
        ReturnReason.DEFECTIVE,
        '',
        150,
        'user-1',
      );
      ret.send('user-1');
      ret.commit(); // clear uncommitted events
      ret.credit('user-1');
      expect(ret.status).toBe(SupplierReturnStatus.CREDITED);
      const events = ret.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SupplierReturnCreditedEvent);
      expect((events[0] as SupplierReturnCreditedEvent).slabIds).toEqual([
        'slab-1',
      ]);
    });

    it('should throw when not SENT', () => {
      const ret = makeReturn();
      expect(() => ret.credit('user-1')).toThrow(
        InvalidReturnTransitionException,
      );
    });
  });

  describe('cancel', () => {
    it('should cancel from DRAFT', () => {
      const ret = makeReturn();
      ret.cancel('user-1');
      expect(ret.status).toBe(SupplierReturnStatus.CANCELLED);
    });

    it('should cancel from SENT', () => {
      const ret = makeReturn();
      ret.addItem(
        'slab-1',
        'bundle-1',
        ReturnReason.DEFECTIVE,
        '',
        150,
        'user-1',
      );
      ret.send('user-1');
      ret.cancel('user-1');
      expect(ret.status).toBe(SupplierReturnStatus.CANCELLED);
    });

    it('should throw when CREDITED', () => {
      const ret = makeReturn();
      ret.addItem(
        'slab-1',
        'bundle-1',
        ReturnReason.DEFECTIVE,
        '',
        150,
        'user-1',
      );
      ret.send('user-1');
      ret.credit('user-1');
      expect(() => ret.cancel('user-1')).toThrow(
        InvalidReturnTransitionException,
      );
    });
  });
});
