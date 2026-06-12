import React from 'react';
export default function ConversionFooter({ setting }) {
    var _a;
    const whatsappNumber = (_a = setting === null || setting === void 0 ? void 0 : setting.storeWhatsappNumber) !== null && _a !== void 0 ? _a : '573002171521';
    const message = encodeURIComponent('Hola INCAP! Tengo un problema técnico de pegue en mi planta y necesito asesoría.');
    return (React.createElement("section", { className: "py-32 bg-[#181B1C] relative overflow-hidden border-t border-white/5" },
        React.createElement("div", { className: "max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10" },
            React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-20 items-center" },
                React.createElement("div", { className: "text-left" },
                    React.createElement("div", { className: "inline-block bg-[#85C639]/10 border border-[#85C639]/20 px-6 py-2 rounded-lg mb-10" },
                        React.createElement("span", { className: "text-[#85C639] font-black text-xs uppercase tracking-[0.4em]" }, "Soporte T\u00E9cnico Especializado")),
                    React.createElement("h2", { className: "text-5xl md:text-8xl font-black font-sora mb-10 uppercase tracking-tighter leading-[0.9] text-white" },
                        "\u00BFFallas de ",
                        React.createElement("br", null),
                        React.createElement("span", { className: "text-[#85C639]" }, "Pegue?")),
                    React.createElement("div", { className: "mb-16 max-w-2xl space-y-5" },
                        React.createElement("p", { className: "text-2xl md:text-3xl text-white font-sora font-bold leading-tight" }, "Cada unidad defectuosa es una devoluci\u00F3n, una queja y una venta perdida."),
                        React.createElement("p", { className: "text-lg text-slate-400 font-inter font-light leading-relaxed" }, "Cu\u00E9ntanos tu caso por WhatsApp y en menos de 24 horas un t\u00E9cnico INCAP te dice exactamente qu\u00E9 est\u00E1 pasando, sin costo, sin compromiso."),
                        React.createElement("p", { className: "text-base text-slate-500 font-inter font-light leading-relaxed" }, "Hemos diagnosticado fallas en m\u00E1s de 200 plantas. El 90% se resuelve ajustando el producto, la temperatura de aplicaci\u00F3n o el tiempo abierto. El otro 10% requiere reformulaci\u00F3n, y para eso tambi\u00E9n estamos.")),
                    React.createElement("a", { href: `https://wa.me/${whatsappNumber}?text=${message}`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex bg-[#85C639] text-[#181B1C] px-16 py-8 rounded-full font-black text-2xl hover:bg-white hover:scale-110 transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(133,198,57,0.4)] items-center gap-6 uppercase tracking-tighter" }, "HABLAR CON UN EXPERTO")),
                React.createElement("div", { className: "relative group hidden lg:flex justify-center" },
                    React.createElement("div", { className: "relative max-w-md w-full" },
                        React.createElement("div", { className: "absolute -inset-10 bg-[#2A4899]/20 rounded-[4rem] blur-3xl group-hover:bg-[#2A4899]/30 transition-all duration-700" }),
                        React.createElement("div", { className: "relative rounded-[3rem] border border-white/10 shadow-2xl shadow-black/50 p-6" },
                            React.createElement("div", { className: "rounded-2xl overflow-hidden" },
                                React.createElement("img", { src: "/images/sections/Fallas_De_Pegue_contacto.webp", className: "w-full h-auto object-cover transform scale-90 group-hover:scale-[0.945] transition-transform duration-1000", alt: "T\u00E9cnico INCAP en planta", loading: "lazy" }),
                                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-[#181B1C]/60 to-transparent" })))))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 25
};
export const query = `query { setting { storeWhatsappNumber } }`;
