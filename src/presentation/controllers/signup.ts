import { HttpResponse, HttpRequest} from "../protocols/http";
import {MissingParamsError} from "../errors/missing-params-error";
import {badRequest} from "../helpers/http-helper";


export class SignUpController{
    handle(httpRequest: HttpRequest): HttpResponse{
        const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

        for(const field of requiredFields){
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamsError(field))
            }
        }

    }
}