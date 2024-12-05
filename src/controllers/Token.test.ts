import Token from './Token';
import { Request } from 'express';

// Mock the Request with a header function that returns a value or undefined
const mockRequest = (): Partial<Request> => ({
    header: jest.fn(), 
});

describe('Token', () => {

    test('test constructor', () => {
        const req = mockRequest();
        const token = new Token(req.header as any);

        expect(token.from_ip).toBe("127.0.0.1");
        expect(token.user_id).toBe("AAAA00000000000000000000");
        expect(token.roles).toEqual(["staff"]);
    });

});