import WebSocket , {WebSocketServer} from "ws";

const wss = new WebSocketServer({port:8080});

let User:Record<string , WebSocket[]> = {}

function addToUser(roomId:string , socket:WebSocket)
{
    if(!User[roomId])
        User[roomId] = []
    User[roomId].push(socket);
}

wss.on("connection" , (socket)=>{
    
    socket.on("message",(message)=>{
        const object = JSON.parse(message.toString());

        if(object.type == "join")
        {
            addToUser(object.payload.roomId , socket);
        }
        if(object.type == "send")
        {
            User[object.payload.roomId]?.forEach((s)=>{
                if(s != socket)
                    s.send(object.payload.message);
                else
                    s.send("message sent!!!!");
            })
        }

        console.log(User)
    })

    socket.on("close",()=>{
        for(const roomId in User){
            if(User[roomId])
                User[roomId] = User[roomId].filter((s)=>s!=socket);
            if(User[roomId]?.length===0)
                delete User[roomId]
        }
    })
})