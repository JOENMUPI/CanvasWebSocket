package JEMP.ORG;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;	

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/Pizarra")
public class Pizarra{
	public static Set<Session> per = Collections.synchronizedSet(new HashSet<Session>());
	
	@OnMessage
	public void onMessage(String mensaje, Session x)throws IOException {
		System.out.println("tenemos un mensaje: "+mensaje);
		synchronized (per) {
			for (Session p : per) {
				if(p != x) {
					p.getBasicRemote().sendText(mensaje);
				}
			}
		}
	}
	
	@OnOpen
	public void onOpen(Session x)throws IOException{
		per.add(x);
		x.getBasicRemote().sendText("{\"typ3\":true,\"cas3\":true,\"id\":"+x.getId()+"}");
	} 
	
	@OnClose
	public void onClose(Session x) throws IOException { 
		per.remove(x);
		synchronized (per) {
			for (Session p : per) {
				p.getBasicRemote().sendText("{\"typ3\":true,\"cas3\":false,\"id\":"+x.getId()+"}");
			}
		}
	}
	
	@OnError
	public void onError(Throwable e) throws IOException {
	    e.printStackTrace();
	    synchronized (per) {
			for (Session p : per) {
				p.getBasicRemote().sendText( e.toString());
			}
		}
	}
}