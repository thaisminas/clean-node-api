import { HttpResponse, HttpRequest} from "../protocols/http";
import {badRequest, serverError} from "../helpers/http-helper";
import { InvalidParamsError, MissingParamsError } from "../errors";
import { Controller, EmailValidator } from "../protocols";


export class SignUpController implements Controller{
    private readonly emailValidator : EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
    }

    handle (httpRequest: HttpRequest): HttpResponse {
        try{
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamsError(field))
                }
            }
            const isValid = this.emailValidator.isValid(httpRequest.body.email)
            if (!isValid) {
                return badRequest(new InvalidParamsError('email'))
            }
        } catch(err){
            return serverError()
        }
    }
}