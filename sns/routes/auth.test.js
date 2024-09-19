const app = require('../app');
const request = require('supertest');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync( { force: true });
})

describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app).post('/auth/join')
        .send({
            email: 'jh1937@naver.com',
            nick: 'jh1937',
            password: 'jh1937'
        })
        .expect('Location', '/')
        .expect(302, done)
    });

    test('회원가입을 이미 하였으나 또다시 시도하는 경우', (done) => {
        request(app).post('/auth/join')
        .send({
            email: 'jh1937@naver.com',
            nick: 'jh1937',
            password: 'jh1937'
        })
        .expect('Location', '/join?error=exist')
        .expect(302, done)
    });
});

describe('POST /join', () => {
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
        .post('/auth/login')
        .send({
            email: 'jh1937@naver.com',
            password: 'jh1937'
        })
        .end(done)
    });
    test('로그인을 하였으면 회원 가입 진행 X', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent.post('/auth/join')
        .send({
            email: 'jh1937@naver.com',
            nick: 'jh1937',
            password: 'jh1937'
        })
        .expect('Location', `/?error=${message}`)
        .expect(302, done)
    });
});

describe('POST /login', () => {
    test('로그인 수행', (done) => {
        request(app).post('/auth/login')
        .send({
            email: 'jh1937@naver.com',
            password: 'jh1937'
        })
        .expect('Location', '/')
        .expect(302, done)
    });

    test('가입되지 않은 회원', (done) => {
        const message = '가입되지 않은 회원입니다.';
        request(app).post('/auth/login')
        .send({
            email: 'jh19371@naver.com',
            password: 'jh1937'
        })
        .expect('Location', `/?loginError=${encodeURIComponent(message)}`)
        .expect(302, done)
    });

    test('비밀번호 x', (done) => {
        const message = '비밀번호가 일치하지 않습니다.';
        request(app).post('/auth/login')
        .send({
            email: 'jh1937@naver.com',
            password: 'jh19371'
        })
        .expect('Location', `/?loginError=${encodeURIComponent(message)}`)
        .expect(302, done)
    });
})

describe('GET /logout', () => {
    test('로그인되어 있지 않으면 403', (done) => {
        request(app).get('/auth/logout')
        .expect(403, done)
    });

    const agent = request.agent(app);
    beforeEach((done) => {
        agent
        .post('/auth/login')
        .send({
            email: 'jh1937@naver.com',
            password: 'jh1937'
        })
        .end(done)
    });
    test('로그아웃 수행', (done) => {
        agent
        .get('/auth/logout')
        .expect('Location', '/')
        .expect(302, done);
    });

});