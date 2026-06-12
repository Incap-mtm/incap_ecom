import React from 'react';
interface HeroSlide {
    id: string;
    deskImage: string;
    mobileImage?: string | null;
    alt?: string | null;
}
interface HeroSliderProps {
    heroSliderWidget?: {
        slides?: HeroSlide[];
        autoplaySpeed?: number;
    };
}
export default function HeroSlider({ heroSliderWidget }: HeroSliderProps): React.JSX.Element | null;
export declare const query = "\n  query Query($slides: [HeroSlideInput], $autoplaySpeed: Int) {\n    heroSliderWidget(slides: $slides, autoplaySpeed: $autoplaySpeed) {\n      slides {\n        id\n        deskImage\n        mobileImage\n        alt\n      }\n      autoplaySpeed\n    }\n  }\n";
export declare const fragments = "\n  fragment HeroSlideData on HeroSlide {\n    id\n    deskImage\n    mobileImage\n    alt\n  }\n";
export declare const variables = "{\n  slides: getWidgetSetting(\"slides\"),\n  autoplaySpeed: getWidgetSetting(\"autoplaySpeed\")\n}";
export {};
