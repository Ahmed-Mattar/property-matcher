import config from '../../src/config/config.js';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';
import User from '../../src/users/user.schema.js';
import Ad from '../../src/ads/ad.schema.js';
import PropertyRequest from '../../src/property-requests/property-request.schema.js';


const { expect } = chai;
chai.use(chaiHttp);

const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
};

describe('Admin Stats Endpoint', () => {
  let adminToken;
  let clientToken;
  let user1, user2, user3;

  before(async () => {
    await mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

    user1 = await User.create({ name: 'Admin User', phone: '+1234567890', password: 'adminpass', role: 'ADMIN' });
    user2 = await User.create({ name: 'Client User', phone: '+1987654321', password: 'clientpass', role: 'CLIENT' });
    user3 = await User.create({ name: 'Agent User', phone: '+1098765432', password: 'agentpass', role: 'AGENT' });



    adminToken = generateToken(user1);
    clientToken = generateToken(user2);

    await Ad.create({ propertyType: 'APARTMENT', area: 100, price: 2000, city: 'City1', district: 'District1', user: user3._id, description: "description1" });
    await PropertyRequest.create({ propertyType: 'APARTMENT', area: 100, price: 2000, city: 'City1', district: 'District1', user: user2._id, description: "description2" });
  });

  after(async () => {
    await Promise.all([
      User.deleteMany({ _id: { $in: [user1._id, user2._id, user3._id] } }),
      Ad.deleteMany({ user: user3._id }),
      PropertyRequest.deleteMany({ user: user2._id })
    ]);
    await mongoose.disconnect();
    process.exit(0);
  });

  describe('GET /api/admin/stats', () => {
    it('should return statistics for admins', (done) => {
      chai.request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ page: 1, limit: 10 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          expect(res.body.page).to.equal(1);
          expect(res.body.limit).to.equal(10);
          expect(res.body).to.have.property('hasNextPage');
          expect(res.body).to.have.property('hasPreviousPage');
          done();
        });
    });

    it('should return 403 for non-admin users', (done) => {
      chai.request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${clientToken}`)
        .query({ page: 1, limit: 10 })
        .end((err, res) => {
          expect(res).to.have.status(403);
          done();
        });
    });

    it('should return 401 if no token is provided', (done) => {
      chai.request(app)
        .get('/api/admin/stats')
        .query({ page: 1, limit: 10 })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});