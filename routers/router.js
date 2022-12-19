const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db.js');
const file = require('fs');
const multer = require('multer');
const html = `<!doctype html>
<html>
<head>
<title>NodeHtml</title>
</head>
<body>
<h1>Hello Node</h1>
<form action="/name" method="POST">
<input type="text" name="name" placeholder="이름을 입력하세요">
<input type="submit" value="확인">
</form>
</body>
</html>
`;
router.get('/', function (req, res) {
  //Cookies that have not been signed
  console.log('Cookies:', req.cookies);

  console.log('Singned Cookies: ', req.signedCookies);
  res.cookie('cookieKey', 'cookievalue', {
    maxAge: 600000,
    httpOnly: true
  })
  res.status(200).send('testcookies');
  /*  maxAge //쿠키의 수명을 밀리초로 나타냄
    expire // 만료일자를 GMT방식의 시간으로 
    path //해당 디렉토리와 하위 디렉토리에서만 경로가 활성화됨
    domain // 도메인 명
    rescure // 웹 브라우저와 웹서버가 HTTPS로 통신하는 경우에만 쿠키를 서버로 전송한다. (HTTP'S'의 'S'는 세큐리티 보안)
    httpOnly //웹서버를 통해서만 쿠키에 접근 가능 자바스크립트로 쿠키에 접속하는 접속을 방지
    signed // 쿠키의 암호화를 결정.*/
})

router.get("/", (req, res) => {
  res.send(html);
})
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, './public/uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); //파일의 확장자
      done(null, path.basename(file.originalname, ext) + Date.now() + ext); //파일명 + 날짜 + 확장자명
    }
  }),
  limits: {
    fileSize: 1024 * 1024 * 2
  } // 2메가용량 까지 업로드 가능
});

router.route('/name').post((req, res) => {
  let paraname = req.body.name;
  //res.send res.writeHead,res.write,res.end()를 한번에 해결 
  //res.send 한번만  사용 가능하다. 
  //res.send 두번 이상 사용 해도 출력되지 않고 무시 해버림
  res.send(`${paraname}님 반갑습니다.`);
  res.send('<br> 안녕하세요');
})

router.get('/edit', (req, res) => {
  res.render('edit')
})

router.get('/men', (req, res) => {
  res.render('men')
})

router.post('/join', (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let name = param['name'];
  let address = param['address'];
  let birth = param['birth'];
  let id = param['id'];
  let pw = param['pw'];
  // let userPwCon = param['pwConfirm'];
  console.log(name);
  console.log(birth);
  console.log(address);
  console.log(id);
  console.log(pw);
  db.hmJoin(name,address,birth,id,pw,() =>{
    res.render('joinresult', {'data': param});
    // res.redirect('/login');
  })
})
router.get('/Inquiry', (req, res) => {
  res.render('Inquiry')
})

router.get('/noticelist', (req, res) => {
  db.getMemo((rows, index) => {
    res.render('noticelist', {
      rows: rows,
      index: index
    });
  })
});

router.get('/reading', (req, res) => {
  let id = req.query.id;
  console.log(id);
  db.getHmByid(id, (row) => {
    res.render('reading', {
      row: row[0]
    })
  })
})

router.get('/updateh', (req, res) => {
  let id = req.query.id;
  console.log(id)
  db.getHmByid(id, (row) => {
    res.render('updateH', {
      row: row[0]
    })
  })
})

router.post('/updateH', (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let id = param['id'];
  let content = param['content'];
  let name = param['name'];
  db.updateHm(id, content, name, () => {
    res.redirect('/noticelist');
  })
})
router.get('/deleteh', (req, res) => {
  let id = req.query.id;
  console.log(id)
  db.deleteByid(id, () => {
    res.redirect('/noticelist')
  })
})

router.post('/noticewrite', (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let name = param['user_name'];
  let content = param['content'];
  console.log(name);
  console.log(content);
  db.insertHm(name, content, ()=>{
    res.redirect('/noticelist')
  })
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/loginH', (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let id = param['user_id'];
  let pw = param['user_pw'];
  db.loginCheck(id, pw, (results) => {
    if (results.length>0) {
      res.render('joinresult' , {'data': param});
    } else {
      res.send(`<script>alert("로그인 정보가 일치하지 않습니다."); document.location.href="/login";</script>`)
    }
  })
})
router.get('/main', (req, res) => {
  res.render('main');
})


router.get('/fixRead', (req, res) => {
  let id = req.query.id;
  console.log(id);
  db.getHmfixByid(id, (row) => {
    res.render('fixRead', {
      row: row[0]
    })
  })
})

router.get('/newDress', (req, res) => {
  db.gethmfix((rows, index) => {
    res.render('newDress', {
      rows: rows,
      index: index
    });
    res.render('newDress');
  })
})

router.post('/fixPlace', (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  let id = param['id'];
  let img = param['img'];
  let name = param['name'];
  db.updateHmfix(id, img, name, () => {
    res.redirect('/newDress');
  })
})
router.get('/deletefix', (req, res) => {
  let id = req.query.id;
  console.log(id)
  db.deleteByhmfixid(id, () => {
    res.redirect('/newDress')
  })
})

router.get('/join', (req, res) => {
  let param = JSON.parse(JSON.stringify(req.body));
  res.render('join');
})




module.exports = router;