var express = require('express');
var router = express.Router();
var User=require('../model/user')
var Mess=require('../model/Mese')
var passport = require('passport');
var Room=require('../model/Room');
var MessS=require('../model/messsingle');
const bcrypt = require('bcrypt');
const {isUser}=require('../config/auth');
const e = require('express');
const convertObjectID=require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/room', isUser,function(req, res, next) {
  var id2=req.user._id;
  var room=[];
  Mess.find({},function(err,data){
    Room.find({},function(err,doc){
      doc.forEach(el=>{
        // console.log('danh sach phong:: ' + el.name);
        el.user.forEach(item=>{
          // console.log(id2);
          // console.log(item);
          // console.log(id2 == item);
          if(id2 == item){
            room.push(el);
          }
        })
      })
      res.render('roomChat',{data:data,room:room});
      // res.send('Danh sach phong cua: ' + req.user.nickname + " la: " + room)


    })
      // res.send(room);
    })

  
})

router.get('/:id',isUser,function(req,res,next){
  var idUser=req.user.id;
  var idOther=req.params.id;
      var newMess=new MessS({
      iduserone:idUser,
      idusertwo:idOther
    })
  function check(n){
    return (n.iduserone == idUser || n.iduserone == idOther) &&  (n.idusertwo == idUser || n.idusertwo == idOther);
  }
  User.findOne({_id:idOther},function(err,data){
    MessS.find({},function(err,doc){
      var arr=doc.filter(check);
      if(arr.length==0){
        console.log("Chua co nen tao")
        newMess.save().then((s)=>{
        // res.send('Ok chuwa co nen tao' + arr)
        MessS.find({},function(err,mess){
          var s=mess.filter(check);
          res.render('chat',{data:data,id:idOther,mess:s})
          //  res.json(data,idOther,arr)

        })
        // res.render('chat',{data:data,id:idOther,mess:arr})


      });

      }else{
        console.log('co roi');
        res.render('chat',{data:data,id:idOther,mess:arr})
        // res.json(data,idOther,arr)


    }
    })

  })

})


//get chat user with user
router.get('/chat/:id',isUser,function(req,res,next){
  var idOther=req.params.id;
  var idUser=req.user._id;

  var newUserChat=new MessS({
    iduserone:idUser,
    idusertwo:idOther,
  })
  function check(n){
    return (n.iduserone == idUser || n.iduserone == idOther) &&  (n.idusertwo == idUser || n.idusertwo == idOther);
  }
  MessS.find({},function(err,doc){
    var arr=doc.filter(check);
    if(arr.length==0){
      console.log('chua co nen tao');
      newUserChat.save().then((s)=>{
        MessS.find({},function(err,mess){
          var s=mess.filter(check);
          // res.json(s);
          res.render('chatUser',{mess:s,id:idOther})
        })
      })
    }else{
      console.log('co roi');
      // res.json(arr)
      res.render('chatUser',{mess:arr,id:idOther})

    }
  })
})

router.post('/signup',function(req,res,next){
  
  var newUser=new User({
    username:req.body.username,
    nickname:req.body.nickname,
    password:req.body.pass
  })
  // bcrypt.genSalt(10,(err,salt)=>{
  //   bcrypt.hash(newUser.password,salt,(err,hash)=>{
  //     newUser.password=hash;
  //     newUser.save().then(()=>{
  //       res.redirect('/');
  //     })
  //   })
  // })
  newUser.save().then(()=>{
    req.flash('success_msg','Đăng ký thành công');
    res.redirect('/');
  })
  
})

router.post('/',(req,res,next)=>{
  passport.authenticate('local',{
  successRedirect:'/users/room',
  failureRedirect:'/',
  failureFlash:true,
})(req,res,next);
})

router.post('/room--add',isUser,function(req,res,next){
  var newRoom=new Room({
    name:req.body.nameRoom,
    user:req.user.id,
  })
  newRoom.save().then(()=>{
    // res.send(newRoom);
    // res.redirect('back');
    res.json(newRoom);
  })
})

router.get('/room/:id',function(req,res,next){
  var id=req.params.id;
  var id2=req.user._id;
  // res.send(id == id2);
  var roomUser=[];
  var roomID=[];
  Room.find({},function(err,data){
   data.forEach(el=>{

    el.user.forEach(item=>{
 
      if(id2==item){
        roomID.push(el);
      }
     })
    // res.json(roomID)
  })
  // res.send('Danh sach phong cua: ' + req.user.nickname + " la: " + roomID)
  res.json(roomID);
  })
})

// router.get('/:id',(req,res,next)=>{
//   MessP.find({})
// })


router.get('/test/room',function(req,res,next){
  res.render('chatPrivate');
})

router.get('/chat--w/:id',function(req,res,next){
  var idOther=req.params.id;
  var idUser=req.user._id;
  var newUserChat=new MessS({
    iduserone:idUser,
    idusertwo:idOther,
  })
  function check(n){
    return (n.iduserone == idUser || n.iduserone == idOther) &&  (n.idusertwo == idUser || n.idusertwo == idOther);
  }
  MessS.find({},function(err,doc){
    var arr=doc.filter(check);
    if(arr.length==0){
      newUserChat.save().then((s)=>{
        MessS.find({},function(err,mess){
          var s=mess.filter(check);
          var resuilt={
            idUser:idUser,
            idOther:idOther,
            content:s,
          }
          res.json(resuilt);
          // res.render('chatUser',{mess:s,id:idOther})
        })
      })
    }else{
      console.log('co roi');
      // res.json(arr)
      // res.render('chatUser',{mess:arr,id:idOther})
      var resuilt={
        idUser:idUser,
        idOther:idOther,
        content:arr,
      }
      res.json(resuilt);
    }
  })
})



// Group

router.get('/room/group/:id',function(req,res,next){
  var id=req.params.id;
  var idUser=req.user._id;
  Room.findById({_id:id},function(err,data){
    if(data!=null){
      if(data.user.indexOf(idUser)>=0){
        res.render('groups',{data:data});
      }else{
        res.send('Khoogn co trng phong nha ban');
      }
    }else{
      res.send('loi')
    }
           
      })
})
// router.get('/room/group/:id',function(req,res,next){
//   var idGroup=convertObjectID(req.params.id);
//   var find={
//     idGroup:req.params.id
//   }
//   var idUser=req.user._id;
//   var a=[];
//   Room.find({},function(err,data){
//     data.forEach(el=>{
//       a.push(el._id);
//     })
//     console.log(typeof idGroup);
//     console.log(a);
//     console.log(a.indexOf(convertObjectID(idGroup)));
//    a.forEach(el=>{
//      console.log(el);
//    })
//     console.log('k oco');
//     // group=data.map(el=>el._id);
//     // console.log(idGroup);
//     // console.log(group.indexOf(idGroup));
//     res.send(data);
    
//     // group.forEach(el=>{
//     //   if(el==idGroup){
//     //    return res.send('ok');
        
//     //   }
//     //   res.send('loi');
//     // })
  
//   })
// })
//Thêm thành viên
router.post('/room/group/:id',function(req,res,next){
  var idGroup=req.params.id;
  // Room.update({_id:id},)
  // console.log(req.body.name)
  var idUser=req.body.name;
  // console.log(idUser);
  Room.find({_id:idGroup},function(err,data){
    data.forEach(el=>{
      // console.log(el);
      if(el.user.indexOf(idUser)>=0){
        console.log('đã có thành viên này');
        res.json(el.user);
      }else{
        Room.update({_id:idGroup},{$addToSet:{user:idUser}},{upsert:true},function(err,user){
          console.log('da them' + user);
          res.json(user);
        })
      }
    })
  })
  
})
//Lấy danh sách thành viên
router.get('/room/group-user/:id',isUser,function(req,res,next){
  var idGroup=req.params.id;
  Room.find({_id:idGroup},function(err,data){
    // console.log(data.user);
    data.forEach(el=>{
      res.json(el.user)
    })
  })
})
//Xoá thành viên
router.post('/room/group--remove/:id',isUser,function(req,res,next){
  var idGroup=req.params.id;
  var userRemoved=req.body.name;
  Room.update({_id:idGroup},{$pull:{user:userRemoved}},{upsert:true},function(err,user){
    console.log('Da xoa: ' + user);
  })
})

//Xoá nhóm
router.get('/room/group--removes/:id',function(req,res,next){
  var id=req.params.id;
  Room.findByIdAndDelete(id).exec();
  res.redirect('/users/room');
})

router.get('/room/group--out/:id',isUser,function(req,res,next){
  var idGroup=req.params.id;
  var userRemoved=req.user._id;
  Room.update({_id:idGroup},{$pull:{user:userRemoved}},{upsert:true},function(err,user){
    res.redirect('/')
  })
})


// Lấy thông tin
router.get('/info/:id',function(req,res,next){
  var idUser=req.params.id
  User.findOne({_id:idUser},function(err,info){
    res.json(info);
  })
})

router.get('/information/:id',function(req,res,next){
  var idUser=req.params.id
  User.findOne({_id:idUser},function(err,info){
    res.render('information',{data:info})
  })
})

router.post('/updateinfo/:id',isUser,function(req,res,next){
  var idUser=req.params.id;
  var newInfo={
    nickname:req.body.name,
    img:req.body.img
  }
  User.update({_id:idUser},newInfo,{upsert:true},function(err,info){
    res.json(info);
    req.flash('success_msg','Cập nhật thành công');
  })
})
module.exports = router;
