const {User} = require('../../models/users');
const auth = require('../../middleware/auth' );
const { JsonWebTokenError } = require('jsonwebtoken');
const mongoose = require('mongoose');
describe('auth middleware unit ', ()=>{
    it('should populate req.user with the payload of valid JWT',()=>{
        const user = {_id:mongoose.Types.ObjectId().toHexString(),
             isAdmin: true };
        const token = User.generateAuthToken();
        const req = {
            header : Jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();
        auth(req, res , next)
        expect(req.user).toBeDefined();
        expect(req.user).toMatchObject(user);
    });
});