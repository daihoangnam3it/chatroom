var socket=io();

var idUser=document.getElementById('idUser');
var nameUser=document.getElementById('nameUser');
var boxActive=document.querySelector('.box--active');
var boxChat=document.querySelector('.box--chat');
var idOne=document.getElementById('idone')
var idTwo=document.getElementById('idtwo')
var clickTest=document.getElementById('clickTest');
var inputSendImg=document.getElementById('inputSendImg');
var imgDemo=document.getElementById('imgSend')
var load=document.querySelector('.load');
var sendMess=document.getElementById('clickSendMess');
var messUser=document.getElementById('messUser');
var boxGroup=document.querySelector('.box--chat--group')


idOne.value='';
idTwo.value='';

socket.emit('signin',{
    id:idUser.value,
    username:nameUser.innerHTML,
})

socket.on("active",data=>{
    boxActive.innerHTML='';

    data.forEach(el=>{
        const s=document.createElement('div');
        s.classList.add('active--list');
        let inner=``;
        if(el.id!=idUser.value&&el.username!=nameUser.innerHTML){
            inner=`<li class="user--active" href="/users/chat--w/${el.id}" id="${el.id}" style="cursor:pointer;">${el.username}</li>`; 
        }
        // let inner=`${el.id}`;
        s.innerHTML=inner;
        boxActive.appendChild(s);
    })
    var userActive=document.querySelectorAll('.user--active');
    userActive.forEach(el=>{
        el.addEventListener('click',()=>{
            boxChat.innerHTML='';
            load.style.opacity='1';
            load.style.visibility='visible'
            var idLink=el.getAttribute('id');
            // alert(idLink);
            let inner= ``;
            fetch('/users/chat--w/'+idLink).then(res=>res.json()).then(data=>{
                console.log(data)
                idOne.value=data.idOther;
                idTwo.value=data.idUser;
                data.content.forEach(el=>{
                    console.log(el.content);
                    var b=el.content.map(ite=>ite);
                    // boxChat.innerHTML=''; 
                    load.style.opacity='0';
                    load.style.visibility='hidden'
                    b.forEach(item=>{

                        // console.log(item.iduser);
                        const s=document.createElement('div');
                        if(item.iduser===idUser.value){
                            s.classList.add('active--list--me');
                        }else{
                            s.classList.add('active--list');
                        }
                        let inner=``;
                        inner =`
                        <span id="${item.iduser===idUser.value?'me':'you'}">${item.mess}</span> <br>
                        ${item.img!=null?`<img src="${item.img}" id="${item.iduser===idUser.value?'me':'you'}" alt="" style="max-width: 50px;height: 50px;"> <br>`:''}
                        `
                         s.innerHTML=inner;
                         boxChat.appendChild(s);
                         boxGroup.scrollTop=boxGroup.scrollHeight;
                    
                    })
                })
                
            });
        })
    })
    
})

clickTest.addEventListener('click',()=>{
    // console.log(idOne.value + "     " + idTwo.value);
    alert(idOne.value + "     "  + idTwo.value)
})
// Input Img and show
inputSendImg.addEventListener('change',()=>{
    const file =document.getElementById('inputSendImg').files;
    if(file.length>0){
        var reader=new FileReader(this);
        reader.onload=el=>{
            imgDemo.setAttribute('src',el.target.result);
        }
        reader.readAsDataURL(file[0]);
    }
})


// Base 64 

var b64;
imgDemo.onload=function(){
    var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    canvas.height=this.naturalHeight;
    canvas.width=this.naturalWidth;
    ctx.drawImage(this,0,0);
    b64=canvas.toDataURL('image/jpeg');
    // console.log(data);
    
}

// Gửi tin nhắn qua lại nèeeeeeee

sendMess.addEventListener('click',()=>{
    if(idOne.value == '' || idTwo.value == ''){
        alert('Ko có đối tượng để nhắn bạn ơi')
    
    }else{
        if(messUser.value == '' && inputSendImg.value==null){
            alert('Nhập tin nhắn bạn ơi');
        }else{
            socket.emit('priva--mess',{
                name:nameUser.innerHTML,
                idtwo:idOne.value,
                idone:idTwo.value,
                mess:messUser.value,
                img:b64,
                createAt:Date.now()
            })
            socket.emit('send--mess-pri',{idOne:idOne.value,idTwo:idTwo.value,mess:messUser.value,img:b64,name:nameUser.innerHTML})
            const s=document.createElement('div');
            s.classList.add('active--list--me');
            let inner=`<span id="me"> ${messUser.value}</span> <br>
            ${b64!=null?`<img src="${b64}" id="me" alt="" style="max-width: 50px;height: 50px;" > <br>`:''}
            `;
            
            s.innerHTML=inner;
            boxChat.appendChild(s);
            boxGroup.scrollTop=boxGroup.scrollHeight;

            messUser.value='';
            imgDemo.setAttribute('src','');
            inputSendImg.value=null;

        }
    }
    b64=null;
})

// Nhận tin nhăn nè
socket.on('sever--send--mess--prive',data=>{
    if((data.idOne==idOne.value ||data.idOne==idTwo.value) && (data.idTwo==idTwo.value || data.idTwo == idOne.value)){
        const s=document.createElement('div');
        console.log(data.img)
        s.classList.add('active--list');
       
          let inner=`<span id="you"> ${data.mess}</span> <br>
        ${data.img != null ? `<img src="${data.img}" id="you" alt="" style="max-width: 50px;height: 50px;"> <br>`:''}
        `;
          s.innerHTML=inner;
          boxChat.appendChild(s);

    }
    boxGroup.scrollTop=boxGroup.scrollHeight;

  })


  socket.on('have--send',data=>{
      alert(data);
  })

  socket.on('sever--noti',data=>{
      if(data.idSend==idUser.value){
          if(data.idUser!=idOne.value){
              alert('ok')
          }
      }
  })