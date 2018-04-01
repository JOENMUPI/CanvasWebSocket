var local=false, color='#'+Math.floor(Math.random()*16777215).toString(16), ws, users=[],nom,id;
class user{ constructor(x,y){ this.name = x; this.id = y; } }
function $(id) { return document.getElementById(id); }
function start(){
    login();
    WS();
    ctx = $('canvas').getContext('2d');
    $('canvas').addEventListener('mousedown',mouseDown,false);
    $('canvas').addEventListener('mouseup',mouseUp,false);
    $('canvas').addEventListener('mouseout',mouseUp,false);
}
function mouseUp(e){ local = false; canvas.removeEventListener('mousemove',mouseMove,false); }
function mouseDown(e){
    e == null ? local = false : local = true;
    ctx.beginPath();
    if(local){ 
        Cor = getCoor(e.clientX,e.clientY); 
        ctx.moveTo(Cor.x,Cor.y);
        $('canvas').addEventListener('mousemove',mouseMove,false);
        senData(e,'mouseDown');
    }
} 
function mouseMove(e,e1){
    var Cor;
    if(local){ 
        Cor = getCoor(e.clientX,e.clientY);
        ctx.strokeStyle = color;
        senData(e,'mouseMove');
    } 
    else{ Cor = getCoor(e1.cor.x,e1.cor.y); ctx.strokeStyle = e1.color; putUser(e1.user,e1.id); }
    ctx.lineTo(Cor.x,Cor.y); 
    ctx.stroke(); 
}
function getCoor(clientx,clienty){
    var z = $('canvas').getBoundingClientRect();
    return{ x: clientx - z.left, y: clienty - z.top }
}
function login(){
    nom = ($('Text').value);
    $("modal").style.display = "none";
    $("log").innerHTML = "Username: "+nom;
}
function checkUser(x){
    for(var i = 0; i < users.length; i++){ if(x == users[i].name){ return false; } } 
    return true;
}
function allUsers(){
    var s  = users.length+" compartiendo pizarra contigo\n";
    for(var i = 0; i < users.length; i++){ s +="\n->"+users[i].name; }
    return s;
}
function putUser(x,y){
    if(checkUser(x)){ users.push(new user(x,y)); }
    $("textA").textContent = allUsers(); 
}
function removeUser(x){
    for(var i = 0; i < users.length; i++){ 
        if(users[i].id == x){ users.shift(i); $("textA").textContent = allUsers(); } }
}
function senData(e,metodo){
    ws.send(JSON.stringify( { cor: { x: e.clientX, y:e.clientY }, 
                             nombreMetodo: metodo,
                             user: nom,
                             id: id,
                             color : color } ));
}
function WS(){
    ws = new WebSocket("ws://"+location.host+location.pathname+"Pizarra");
    ws.onopen = function(){ console.log("conectados!"); }
    ws.onerror = function(x){ console.log("Ocurrio un error: "+x.data) };
    ws.onmessage = function(x){ 
        console.log("Se ha recibido un mensaje: "+x.data);
        var json = JSON.parse(x.data);
        if(json.typ3){
            if(json.cas3){ id = json.id; }
            else{ removeUser(json.id); console.log("salio "+json.id); }
        }
        else{ 
            if(json.nombreMetodo == 'mouseMove'){ mouseMove(null,json); }
            if(json.nombreMetodo == 'mouseDown'){ mouseDown(null); }
        }
    };
}