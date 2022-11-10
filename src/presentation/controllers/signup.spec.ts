import {SignUpController} from './signup'
import {MissingParamsError} from "../errors/missing-params-error";
import {InvalidParamsError} from "../errors/invalid-params-error";
import {EmailValidator} from "../protocols/email-validator";

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
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
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
    })
})