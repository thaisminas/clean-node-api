import {SignUpController} from './signup'
import {MissingParamsError} from "../errors/missing-params-error";


const mokeSut = () : SignUpController => {
    return new SignUpController()
}


describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', ()=> {
        //instanciar a classe
        const sut = mokeSut()
        //mock do objeto a ser passado para meu metodo
        const httpRequest = {
            body: {
                email: 'any_email@gmail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        //espera que o meu body seja igual ao erro.
        expect(httpResponse.body).toEqual(new MissingParamsError('name'))
    })

    test('Should return 400 if no email is provided', ()=> {
        const sut = mokeSut()
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
        const sut = mokeSut()
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
        const sut = mokeSut()
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
})