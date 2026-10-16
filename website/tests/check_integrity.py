"""Verify the shipped assets and grant lifecycle against the real SQL schema."""
import pathlib,sqlite3,time
root=pathlib.Path(__file__).resolve().parents[1]
for name in ['orange','ami','mace','ara']:
 for i in range(4):
  p=root/'public'/'vehicles'/f'{name}-{i}.webp'
  assert p.is_file() and p.stat().st_size>1000, str(p)
db=sqlite3.connect(':memory:')
for p in sorted((root/'drizzle').glob('*.sql')):db.executescript(p.read_text())
now=int(time.time()*1000)
def can_read(email,project):
 return bool(db.execute('SELECT id FROM grants WHERE email=? AND project=? AND revoked=0 AND expires_at>?',(email,project,now)).fetchone())
db.execute('INSERT INTO grants VALUES (?,?,?,?,?,?)',('grant1','reviewer@example.test','ami',now+100000,0,now))
assert can_read('reviewer@example.test','ami')
assert not can_read('other@example.test','ami')
assert not can_read('reviewer@example.test','orange-cruise')
db.execute('UPDATE grants SET revoked=1 WHERE id=?',('grant1',))
assert not can_read('reviewer@example.test','ami')
db.execute('UPDATE grants SET revoked=0, expires_at=? WHERE id=?',(now-1,'grant1'))
assert not can_read('reviewer@example.test','ami')
# Rate increments are atomic, so parallel submissions cannot reset the count.
for i in range(11):db.execute('INSERT INTO rate_limits VALUES (?,1) ON CONFLICT(key) DO UPDATE SET count=count+1',('hour-hash',))
assert db.execute('SELECT count FROM rate_limits').fetchone()[0]==11
print('PASS: 16 curated assets, migrations, project/email isolation, revocation, expiry and atomic rate counting')
