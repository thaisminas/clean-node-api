import {SignUpController} from './signup'
import { MissingParamsError, ServerError } from '../errors';
import { EmailValidator } from '../protocols';

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeEmailValidatorWithError = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            throw new Error()
        }
    }

    return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
    //classe do tipo Stub.
    //o que importa aqui e o retorno da funcao e nao como ela sera validado o dado
    //Implementado a interface
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }

    // Instancio a nova classe
    const emailValidatorStub = new EmailValidatorStub()
    // Injeto a classe de validacao de email na minha classe singUp
    const sut = new SignUpController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', ()=> {
        //instanciar a classe
        const { sut } = makeSut()
        //mock do objeto a ser passado para meu metodo
        const httpRequest = {
            body: {
                email: 'any_email@gmail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        //chama meu metodo da classe passando meus dados mocados
        const httpResponse = sut.handle(httpRequest)
        //Assercoes, falando que espero que o status code seja 400
        expect(httpResponse.statusCode).toBe(400)
        //espera que o meu body seja igual ao erro.
        expect(httpResponse.body).toEqual(new MissingParamsError('name'))
    })

    test('Should return 400 if no email is provided', ()=> {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamsError('email'))
    })

    test('Should return 400 if no password is provided', ()=> {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@gmail.com',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamsError('password'))
    })

    test('Should return 400 if no password confirmation is provided', ()=> {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@gmail.com',
                password: 'any_password',
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamsError('passwordConfirmation'))
    })

    test('Should return 400 if an invalid email is provided', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('Should return 500 if EmailValidador throws', () => {
        const emailValidatorStub = makeEmailValidatorWithError()
        
        const sut = new SignUpController(emailValidatorStub)
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const HttpResponse = sut.handle(httpRequest)
        expect(HttpResponse.statusCode).toBe(500)
        expect(HttpResponse.body).toEqual(new ServerError())
    })
})