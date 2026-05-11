import React from 'react';
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return /*#__PURE__*/ React.createElement("footer", {
        className: "bg-[#181B1C] py-8 border-t border-white/5 relative z-40"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "opacity-40 hover:opacity-100 transition-opacity duration-300"
    }, /*#__PURE__*/ React.createElement("svg", {
        viewBox: "0 0 231.9 68.2",
        className: "h-6 w-auto fill-[#475569]"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M69.8,40.6v-40H51.2V21h-0.5L41.9,0.6H23.6c-1.8,0-3.3,1.5-3.3,3.3v40h18.5V23.5h0.5l8.8,20.4h18.4 C68.3,43.9,69.8,42.4,69.8,40.6z"
    }), /*#__PURE__*/ React.createElement("path", {
        d: "M0,11.4c0,1.6,1.3,2.9,2.9,2.9H13L0,23.7v17.9c0,1.2,1,2.2,2.2,2.2h16.3V0.6H0V11.4z"
    }), /*#__PURE__*/ React.createElement("path", {
        d: "M112,24.9c-1.9-0.1-3.7,0.9-4.6,2.6c-0.5,0.8-1.1,1.5-1.8,2c-1.5,1-3.6,1.5-6.3,1.5c-3,0-5.3-0.7-6.7-2.1 c-1.4-1.4-2.1-3.6-2.1-6.5s0.7-5.1,2.1-6.5s3.7-2.1,6.7-2.1c2.6,0,4.5,0.5,5.9,1.5c0.7,0.5,1.2,1.2,1.7,2c1,1.7,2.9,2.7,4.8,2.5 l14-1c-0.2-6.3-2.4-11-6.8-14.1C114.6,1.5,108,0,99.1,0c-9.4,0-16.3,1.8-20.6,5.4v0c-4.4,3.6-6.5,9.2-6.5,16.9s2.2,13.3,6.6,16.9 c4.4,3.6,11.3,5.4,20.8,5.4c8.9,0,15.6-1.5,20.1-4.6c4.5-3.1,6.8-7.8,6.9-14.1L112,24.9z"
    }), /*#__PURE__*/ React.createElement("path", {
        d: "M159.3,43.9h20.4L166.5,3.8c-0.6-1.9-2.4-3.1-4.3-3.1h-24.5l-14.2,43.3h20.4l1.5-6.2h12.5L159.3,43.9z M148.1,26.6l3.3-13.6h0.5l3.3,13.6H148.1z"
    }), /*#__PURE__*/ React.createElement("path", {
        d: "M228.4,6.2c-2.4-2.5-5.2-4.1-8.6-4.7c-3.4-0.6-7.8-0.9-13.4-0.9h-24.6h0v43.3h14.7c2.1,0,3.8-1.7,3.8-3.8v-4.8 h6.1c5.6,0,10.1-0.3,13.5-0.8c3.4-0.5,6.2-2.1,8.5-4.6c2.3-2.5,3.5-6.4,3.5-11.8C231.9,12.7,230.8,8.7,228.4,6.2z M211.9,21.9 c-1,0.6-2.8,0.9-5.5,0.9v0h-6.1v-8.7h6.1c2.7,0,4.5,0.3,5.5,0.9c1,0.6,1.5,1.8,1.5,3.4C213.4,20.2,212.9,21.3,211.9,21.9z"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "text-[10px] font-black text-[#475569] uppercase tracking-[0.3em] font-sora flex items-center gap-2"
    }, "© ", currentYear, " INCAP S.A. ", /*#__PURE__*/ React.createElement("span", {
        className: "opacity-50"
    }, "|"), " CALIDAD QUE SE REPITE")));
}
export const layout = {
    areaId: 'footer',
    sortOrder: 10
};
