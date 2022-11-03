import {SignUpController} from './signup'

describe('SignUp Controller', () => {
    test('Should return 400 if no name is provided', ()=> {
        //instanciar a classe
        const sut = new SignUpController()
        //mock do objeto a ser passado para meu metodo
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@gmail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }

        const httpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        //espera que o meu body seja igual ao erro.
        expect(httpResponse.body).toEqual(new Error('Missing param: name'))
    })
})