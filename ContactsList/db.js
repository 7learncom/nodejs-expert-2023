import pg from 'pg';
 
const pool = new pg.Pool({
    database: '7learn',
    user: 'madmadi',
    password: 'admin',
});

export function query(text, params) {
    return pool.query(text, params);
}
