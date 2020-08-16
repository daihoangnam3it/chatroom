const imgShow=document.getElementById('imgShow');
const inputImg=document.getElementById('img');
const clickChange=document.querySelector('.clickChange');
const idUser=document.querySelector('.userId')
const nameUser=document.querySelector('.userNickName');
inputImg.addEventListener('change',()=>{
    const file=inputImg.files;
    if(file.length>0){
        const reader=new FileReader();
        reader.onload=el=>{
            imgShow.setAttribute('src',el.target.result);
        }
        reader.readAsDataURL(file[0]);
    }
})
var b64;
imgShow.onload=function(){
    var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    canvas.height=this.naturalHeight;
    canvas.width=this.naturalWidth;
    ctx.drawImage(this,0,0);
    b64=canvas.toDataURL('image/jpeg');
    // console.log(data);
    
}
clickChange.addEventListener('click',()=>{
    var newInfo={
        name:nameUser.value,
        img:b64
    }
    fetch('/users/updateinfo/'+idUser.innerHTML,{
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body:JSON.stringify(newInfo)
    }).then(res=>res.json()).then(data=>{
        fetch('/users/info/'+idUser.innerHTML).then(res=>res.json()).then(info=>{
            alert('Đã cập nhật thông tin');
        })
    })
})
