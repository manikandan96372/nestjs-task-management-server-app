import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';

const mockCredsDto = { username : 'sample', password: 'sample' }
describe('UserRepository', () => {
    let userRepository;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ]
        }).compile()
        userRepository = module.get<UserRepository>(UserRepository)
    })

    describe('signUp', () => {
        let save;
        beforeEach(() => {
            save = jest.fn(),
            userRepository.create = jest.fn().mockReturnValue({ save })
        })

        it('user signs up', () => {
            save.mockResolvedValue(undefined)
            expect(userRepository.signUp(mockCredsDto)).resolves.not.toThrow()
        })
    })
})