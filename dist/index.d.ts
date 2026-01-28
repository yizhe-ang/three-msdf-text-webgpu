import * as THREE from 'three/webgpu';

declare interface BMFontChar {
    id: number;
    index?: number;
    char?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    xoffset: number;
    yoffset: number;
    xadvance: number;
    page: number;
    chnl: number;
}

declare interface BMFontCommon {
    lineHeight: number;
    base: number;
    scaleW: number;
    scaleH: number;
    pages: number;
    packed?: number;
    alphaChnl?: number;
    redChnl?: number;
    greenChnl?: number;
    blueChnl?: number;
}

/**
 * Type definitions for BMFont / MSDF JSON format
 * Used by msdf-bmfont / three-msdf-text-utils / WebGL bitmap text renderers
 */
declare interface BMFontInfo {
    face?: string;
    size?: number;
    bold?: number;
    italic?: number;
    charset?: string;
    unicode?: number;
    stretchH?: number;
    smooth?: number;
    aa?: number;
    padding?: [number, number, number, number];
    spacing?: [number, number];
    outline?: number;
}

export declare interface BMFontJSON {
    pages: string[] | BMFontPage[];
    chars: BMFontChar[];
    kernings?: BMFontKerning[];
    info?: BMFontInfo;
    common: BMFontCommon;
}

declare interface BMFontKerning {
    first: number;
    second: number;
    amount: number;
}

declare interface BMFontPage {
    id: number;
    file: string;
}

declare interface CanvasRenderMeasurements {
    width: number;
    actualAscent: number;
    actualDescent: number;
    fontAscent: number;
    fontDescent: number;
    baselineOffsetTop: number;
    baselineOffsetBottom: number;
    lineGap: number;
}

declare interface DomTextMetrics {
    text: string;
    fontCssStyles: TextStyles;
    canvasRenderMeasurements: CanvasRenderMeasurements;
    widthPx: number;
}

export declare class MSDFText extends THREE.Mesh<MSDFTextGeometry, MSDFTextNodeMaterial> {
    constructor(options: MSDFTextOptions, font: {
        atlas: THREE.Texture;
        data: BMFontJSON;
    });
    update(options: Partial<MSDFTextOptions>): void;
    private getCurrentOptions;
}

export declare class MSDFTextGeometry extends THREE.BufferGeometry {
    private width;
    private height;
    private verticalAlign;
    private textAlign;
    private currentMetrics;
    private currentGlyphCount;
    private font;
    get textStyles(): Omit<Partial<TextStyles>, 'color' | 'opacity'>;
    get text(): string;
    constructor(options: MSDFTextGeometryOptions);
    computeBoundingBox(): void;
    update(metrics: DomTextMetrics): void;
}

declare interface MSDFTextGeometryOptions {
    font: BMFontJSON;
    metrics: DomTextMetrics;
}

export declare class MSDFTextNodeMaterial extends THREE.NodeMaterial {
    private map;
    private colorUniform;
    private isSmoothUniform;
    private thresholdUniform;
    readonly defaultColorNode: THREE.Node;
    readonly defaultOpacityNode: THREE.Node;
    get color(): THREE.ColorRepresentation;
    set color(val: THREE.ColorRepresentation);
    get isSmooth(): boolean;
    set isSmooth(val: boolean);
    get threshold(): number;
    set threshold(val: number);
    constructor(options: {
        fontAtlas: THREE.Texture;
        metrics: DomTextMetrics;
    });
    update(metrics: DomTextMetrics): void;
}

declare type MSDFTextOptions = {
    text: string;
    textStyles?: Partial<TextStyles>;
};

export declare class SyncMSDFText extends THREE.Mesh<MSDFTextGeometry, MSDFTextNodeMaterial> {
    readonly element: HTMLElement | undefined;
    constructor(element: HTMLElement, font: {
        atlas: THREE.Texture;
        data: BMFontJSON;
    });
    update(camera: {
        position: THREE.Vector3;
        quaternion: THREE.Quaternion;
        fov: number;
        aspect: number;
    }, depthFromCamera?: number): void;
}

declare interface TextStyles {
    widthPx: number;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string;
    lineHeightPx: number;
    letterSpacingPx: number;
    textAlign: CanvasTextAlign;
    verticalAlign: 'top' | 'center' | 'bottom';
    whiteSpace: 'normal' | 'nowrap' | 'pre';
    color: THREE.ColorRepresentation;
    opacity: number;
}

export { }
