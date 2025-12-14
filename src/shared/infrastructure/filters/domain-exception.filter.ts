import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { DomainException } from "../../domain/domain.exception";
import { UserAlreadyExistsException } from "../../../contexts/users/domain/exceptions/user-already-exists.exception";
import { UserNotFoundExeption } from "../../../contexts/users/domain/exceptions/user-not-found.exception";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    if (exception instanceof UserAlreadyExistsException) {
      statusCode = HttpStatus.CONFLICT;
    }

    if (exception instanceof UserNotFoundExeption) {
      statusCode = HttpStatus.NOT_FOUND;
    }

    response.json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorType: exception.name,
    });
  }
}