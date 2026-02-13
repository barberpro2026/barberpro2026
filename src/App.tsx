import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Scissors, Clock, XCircle, CheckCircle, ChevronRight, Shield, Phone, Play, MessageSquare, Bot, X } from 'lucide-react';

// --- COMPONENTE ICONO WHATSAPP OFICIAL (SVG) ---
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// --- COMPONENTE DE ANIMACIÓN: FADE IN ON SCROLL ---
const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) observer.unobserve(elementRef.current);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => { if (elementRef.current) observer.unobserve(elementRef.current); };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- WIDGET DE DEMOSTRACIÓN DE CHAT ---
const ChatDemoWidget = ({ phoneNumber }: { phoneNumber: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'bot' | 'user' | 'cta', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const script = [
    { role: 'bot', text: 'Hola 👋 gracias por escribir a BarberPro.' },
    { role: 'bot', text: 'Ayudamos a barberías a responder mensajes, agendar citas y confirmar clientes de forma automática por WhatsApp, las 24 horas.' },
    { role: 'bot', text: 'Mientras tú trabajas, el sistema atiende por ti.' },
    { role: 'bot', text: '¿Quieres ver cómo funcionaría en tu negocio?' },
    { role: 'user', text: 'Sí, quiero ver una demostración.' },
    { role: 'cta', text: '¡Excelente! Haz clic abajo 👇' }
  ] as const;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      runScript();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const runScript = async () => {
    for (let i = 0; i < script.length; i++) {
      const msg = script[i];
      if (msg.role === 'bot' || msg.role === 'cta') {
        setIsTyping(true);
        await new Promise(r => setTimeout(r, 800)); // Tiempo simulado de escritura
        setIsTyping(false);
        setMessages(prev => [...prev, msg]);
        await new Promise(r => setTimeout(r, 600)); // Pausa de lectura
      } else {
        await new Promise(r => setTimeout(r, 1200));
        setMessages(prev => [...prev, msg]);
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length > 0) {
      // Opcional: reiniciar chat al cerrar y abrir o mantener estado
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {/* Ventana de Chat */}
      <div className={`mb-4 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transition-all duration-300 origin-bottom-right transform ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-full relative">
              <Bot size={16} />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-300 border border-green-500 rounded-full"></span>
            </div>
            <div>
              <p className="font-bold text-sm">Barber Pro Demo</p>
              <p className="text-xs text-slate-400">En línea</p>
            </div>
          </div>
          <button onClick={toggleChat} className="hover:bg-slate-800 p-1 rounded transition-colors"><X size={18} /></button>
        </div>
        
        {/* Cuerpo Chat */}
        <div ref={scrollRef} className="h-64 overflow-y-auto p-4 bg-slate-50 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'cta' ? (
                 <div className="w-full text-center mt-2">
                   <p className="text-sm text-slate-500 mb-2">{msg.text}</p>
                   <a 
                     href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent("Hola, quiero ver cómo funcionaría en mi negocio.")}`}
                     target="_blank" rel="noopener noreferrer"
                     className="bg-[#25D366] text-white text-sm font-bold py-2 px-4 rounded-full inline-flex items-center gap-1 hover:bg-[#20bd5a] transition-colors"
                   >
                     Contratar Bot <ChevronRight size={14} />
                   </a>
                 </div>
              ) : (
                <div className={`max-w-[85%] p-3 text-sm rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-amber-500 text-black rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-white text-slate-500 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 text-xs italic flex gap-1">
                 <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón Flotante Trigger */}
      <button 
        onClick={toggleChat}
        className={`${isOpen ? 'bg-slate-700' : 'bg-amber-500 hover:bg-amber-400'} text-white p-4 rounded-full shadow-xl transition-all hover:scale-105 flex items-center justify-center relative group`}
        aria-label="Probar Demo Chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute right-full mr-3 bg-white text-slate-900 px-3 py-1 rounded-lg text-sm font-bold shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Probar Chat 🤖
          </span>
        )}
      </button>
    </div>
  );
};


// Tipos para los componentes
interface ProblemCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

interface FeatureRowProps {
  title: string;
  desc?: string;
}

const App = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- EFECTO PARA EL FAVICON (LOGO EN PESTAÑA) ---
  useEffect(() => {
    // Busca el favicon existente o crea uno nuevo
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    // Asigna un emoji de tijeras como favicon (solución rápida y ligera)
    // Para usar una imagen PNG real, reemplaza el href con la URL de tu imagen
    link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✂️</text></svg>";
    document.title = "Barber Pro | Automatización para Barberías";
  }, []);

  // --- NÚMERO DE CONTACTO ---
  const phoneNumber = "573217091411";
  
  // Función optimizada para móviles (api.whatsapp.com en vez de wa.me)
  const getWhatsAppLink = (message: string) => {
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 selection:bg-amber-500 selection:text-white overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-md py-3 border-b border-white/10' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6 md:px-8 flex justify-between items-center">
          <div className="text-white font-black text-2xl tracking-tighter flex items-center gap-2">
            <div className="bg-gradient-to-tr from-amber-400 to-amber-600 p-2 rounded-lg text-black">
              <Scissors size={20} strokeWidth={2.5} />
            </div>
            <span>BARBER<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">PRO</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-white/80 font-medium text-sm">
            <a href="#problema" className="hover:text-amber-400 transition-colors">Problema</a>
            <a href="#solucion" className="hover:text-amber-400 transition-colors">Solución</a>
            <a href="#video-demo" className="hover:text-amber-400 transition-colors">Video</a>
          </div>

          <a 
            href={getWhatsAppLink("Hola 👋 Me gustaría saber más sobre Barber Pro.")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Hablemos</span>
          </a>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative min-h-[90vh] bg-black flex items-center overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 md:px-8 relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center pt-20">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wider uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Tecnología para Barberos
              </div>
            </FadeIn>
            
            <FadeIn delay={100}>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                Tu barbería <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                  abierta 24/7
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={200}>
              <p className="text-slate-400 text-lg lg:text-xl mb-8 leading-relaxed max-w-lg">
                Deja de perder clientes por no responder. Automatizamos tu WhatsApp para agendar citas mientras tú te enfocas en cortar.
              </p>
            </FadeIn>
            
            <FadeIn delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
                <a 
                  href={getWhatsAppLink("Hola 👋 Me gustaría ver una demostración en mi celular.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-500 hover:bg-amber-400 text-black text-lg font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Ver Demo en Vivo <ChevronRight size={20} />
                </a>
              </div>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-black" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                  ))}
                </div>
                <p>Usado por +50 barberías</p>
              </div>
            </FadeIn>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] p-4 border border-slate-700 shadow-2xl max-w-sm mx-auto rotate-[-3deg] hover:rotate-0 transition-all duration-700">
              <div className="bg-black rounded-[2rem] overflow-hidden border border-slate-800 h-[600px] relative">
                <div className="absolute top-0 w-full h-20 bg-slate-900/90 backdrop-blur z-20 flex items-center px-6 border-b border-slate-800">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-black">B</div>
                  <div className="ml-3">
                    <p className="text-white font-bold text-sm">Barber Pro</p>
                    <p className="text-green-500 text-xs">En línea</p>
                  </div>
                </div>
                <div className="p-6 pt-24 space-y-4">
                  <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm">
                    👋 ¡Hola! Bienvenido a Barbería El Patrón. ¿En qué te puedo ayudar hoy?
                  </div>
                  <div className="bg-amber-500 text-black font-medium p-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-sm">
                    Quiero agendar un corte para mañana.
                  </div>
                  <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm">
                    ¡Claro! Tengo estos horarios disponibles:
                    <br/>- 10:00 AM
                    <br/>- 03:30 PM
                    <br/>¿Cuál prefieres? 💈
                  </div>
                </div>
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- SECCIÓN PROBLEMA --- */}
      <section id="problema" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                El problema de <br/><span className="text-red-600">no estar disponible</span>
              </h2>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={0}>
              <ProblemCard 
                icon={<WhatsAppIcon className="text-red-500 w-8 h-8" />}
                title="Interrupciones"
                desc="Dejas de cortar para responder mensajes o pierdes la concentración."
              />
            </FadeIn>
            <FadeIn delay={100}>
              <ProblemCard 
                icon={<Clock className="text-red-500" size={32} />}
                title="Tiempo Perdido"
                desc="Respondes '¿A cómo el corte?' y '¿Dónde están?' 20 veces al día."
              />
            </FadeIn>
            <FadeIn delay={200}>
              <ProblemCard 
                icon={<XCircle className="text-red-500" size={32} />}
                title="Ausentismo"
                desc="Pierdes dinero cuando los clientes olvidan su cita por falta de recordatorio."
              />
            </FadeIn>
            <FadeIn delay={300}>
              <ProblemCard 
                icon={<Shield className="text-red-500" size={32} />}
                title="Fugas nocturnas"
                desc="El cliente que escribe a las 11 PM se va con otro si no respondes ya."
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN: LA SOLUCIÓN DEFINITIVA --- */}
      <section id="solucion" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-8 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <FadeIn delay={0}>
              <span className="text-amber-400 font-bold tracking-wider uppercase text-sm mb-4 block">🟣 La Solución Definitiva</span>
            </FadeIn>
            <FadeIn delay={100}>
              <h2 className="text-3xl lg:text-5xl font-black mb-8 leading-tight">
                Tu WhatsApp trabajando por ti, <span className="text-amber-500">las 24 horas</span>
              </h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                Implementamos un sistema automático en WhatsApp que atiende a tus clientes sin que tengas que estar pendiente del celular.
              </p>
            </FadeIn>
            
            <FadeIn delay={300}>
              <div className="grid sm:grid-cols-2 gap-5">
                <FeatureRow title="Responde mensajes automáticamente" />
                <FeatureRow title="Muestra servicios y precios" />
                <FeatureRow title="Agenda citas sin errores" />
                <FeatureRow title="Envía recordatorios automáticos" />
                <FeatureRow title="Reduce cancelaciones" />
                <FeatureRow title="Funciona en tu propio WhatsApp" />
              </div>
            </FadeIn>
          </div>
          
          <div className="relative flex justify-center">
             <FadeIn delay={200} className="w-full max-w-md">
               <div className="bg-gradient-to-br from-amber-500/20 to-transparent p-1 rounded-3xl w-full">
                  <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
                     <div className="flex items-center gap-4 mb-8 border-b border-slate-700 pb-6">
                        <div className="bg-green-500/20 p-4 rounded-full text-green-500"><Phone size={28} /></div>
                        <div>
                          <h4 className="font-bold text-xl">Asistente Virtual</h4>
                          <p className="text-sm text-slate-400">Siempre activo • 24/7</p>
                        </div>
                     </div>
                     <div className="space-y-6 text-sm md:text-base">
                        <div className="bg-slate-700/50 p-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl w-[85%]">
                          Hola, quiero cortarme el cabello mañana 💈
                        </div>
                        <div className="bg-green-600/20 text-green-100 p-4 rounded-tl-2xl rounded-br-2xl rounded-bl-2xl w-[85%] ml-auto border border-green-500/30">
                          ¡Claro! Tengo disponible a las 10:00 AM y 4:00 PM. ¿Cuál prefieres? ✅
                        </div>
                     </div>
                  </div>
               </div>
             </FadeIn>
          </div>
        </div>
      </section>

      {/* --- NUEVA SECCIÓN: VIDEO DEMOSTRATIVO --- */}
      <section id="video-demo" className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-6 md:px-8 text-center relative z-10">
          <FadeIn>
             <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">
                🎥 Mira cómo funciona
             </span>
             <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-12">
               Experiencia Real en 30 Segundos
             </h2>
             
             {/* VIDEO CONTAINER MEJORADO */}
             <div className="relative w-full max-w-4xl mx-auto aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white mb-8 group">
                <video 
                  className="w-full h-full object-cover" 
                  controls
                  playsInline
                  preload="metadata"
                  // IMAGEN DE PORTADA ACTUALIZADA (Más estilo Barber)
                  poster="https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                >
                  <source src="https://res.cloudinary.com/djbcgcmma/video/upload/v1770854111/barberia_landing_pague_etppr5.mp4" type="video/mp4" />
                  Tu navegador no soporta el tag de video.
                </video>
                
                {/* Botón de Play Decorativo */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm animate-pulse group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-slate-900 ml-1 fill-slate-900" />
                  </div>
                </div>
             </div>
             
             <p className="text-slate-500 text-sm max-w-xl mx-auto">
               * Este es un ejemplo de cómo el bot interactúa con tus clientes en tiempo real.
             </p>
          </FadeIn>
        </div>
      </section>

      {/* --- SECCIÓN DEMO (CTA PURO) --- */}
      <section id="demo" className="py-24 bg-amber-500 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-6 md:px-8 text-center relative z-10">
          <FadeIn>
            <div className="bg-white rounded-3xl p-10 md:p-16 shadow-2xl max-w-4xl mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <span className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                Prueba Gratuita
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">
                ¿Listo para modernizar tu negocio?
              </h2>
              <p className="text-slate-600 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                No dejes pasar más clientes. Prueba el sistema ahora mismo en tu propio celular.
              </p>

              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <a 
                  href={getWhatsAppLink("Hola 👋 Quiero ver una demostración de Barber Pro.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white text-xl font-bold py-5 px-10 rounded-xl shadow-xl shadow-green-600/20 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"
                >
                  <WhatsAppIcon className="w-8 h-8 fill-current" />
                  ABRIR EN WHATSAPP
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
             <Scissors size={20} className="text-amber-500" />
             BARBER PRO
          </div>
          <div className="text-sm">
            © 2024 Hecho para Barberos en Colombia 🇨🇴
          </div>
        </div>
      </footer>

      {/* --- WIDGET CHAT DEMO FLOTANTE --- */}
      <ChatDemoWidget phoneNumber={phoneNumber} />

      {/* --- BOTÓN FLOTANTE PRINCIPAL --- */}
      <a 
        href={getWhatsAppLink("Hola 👋 Tengo una consulta sobre Barber Pro.")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl z-40 transition-transform hover:scale-110 flex items-center justify-center animate-bounce-slow"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </a>

    </div>
  );
};

// --- Componentes Reutilizables con Tipos ---

const ProblemCard = ({ icon, title, desc }: ProblemCardProps) => (
  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-xl hover:border-amber-200 hover:-translate-y-1 transition-all duration-300 group">
    <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:bg-amber-50 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

const FeatureRow = ({ title, desc }: FeatureRowProps) => (
  <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-amber-500/50 transition-colors">
    <div className="bg-amber-500/10 p-1.5 rounded text-amber-500 flex-shrink-0">
      <CheckCircle size={20} />
    </div>
    <div className="flex flex-col">
        <span className="font-medium text-slate-200 text-sm md:text-base">{title}</span>
        {desc && <span className="text-slate-400 text-xs">{desc}</span>}
    </div>
  </div>
);

export default App;