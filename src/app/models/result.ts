// To parse this data:
//
//   import { Convert, Result } from "./file";
//
//   const result = Convert.toResult(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Result {
    _embedded?: Embedded;
    _links?:    ResultLinks;
    page?:      Page;
}

export interface Embedded {
    enheter?: Enheter[];
}

export interface Enheter {
    organisasjonsnummer?:                       string;
    navn?:                                      string;
    organisasjonsform?:                         Organisasjonsform;
    registreringsdatoEnhetsregisteret?:         Date;
    registrertIMvaregisteret?:                  boolean;
    naeringskode1?:                             InstitusjonellSektorkode;
    antallAnsatte?:                             number;
    forretningsadresse?:                        Forretningsadresse;
    stiftelsesdato?:                            Date;
    institusjonellSektorkode?:                  InstitusjonellSektorkode;
    registrertIForetaksregisteret?:             boolean;
    registrertIStiftelsesregisteret?:           boolean;
    registrertIFrivillighetsregisteret?:        boolean;
    sisteInnsendteAarsregnskap?:                string;
    konkurs?:                                   boolean;
    underAvvikling?:                            boolean;
    underTvangsavviklingEllerTvangsopplosning?: boolean;
    maalform?:                                  Maalform;
    lat?:                                       number;
    lng?:                                       number;
    _links?:                                    EnheterLinks;
    frivilligMvaRegistrertBeskrivelser?:        string[];
}

export interface EnheterLinks {
    self?: First;
}

export interface First {
    href?: string;
}

export interface Forretningsadresse {
    land?:          Land;
    landkode?:      Landkode;
    postnummer?:    string;
    poststed?:      string;
    adresse?:       string[];
    kommune?:       string;
    kommunenummer?: string;
}

export enum Land {
    Norge = "Norge",
}

export enum Landkode {
    No = "NO",
}

export interface InstitusjonellSektorkode {
    kode?:        string;
    beskrivelse?: string;
}

export enum Maalform {
    Bokmål = "Bokmål",
}

export interface Organisasjonsform {
    kode?:        Kode;
    beskrivelse?: Beskrivelse;
    _links?:      EnheterLinks;
}

export enum Beskrivelse {
    Aksjeselskap = "Aksjeselskap",
}

export enum Kode {
    As = "AS",
}

export interface ResultLinks {
    first?: First;
    self?:  First;
    next?:  First;
    last?:  First;
}

export interface Page {
    size?:          number;
    totalElements?: number;
    totalPages?:    number;
    number?:        number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toResult(json: string): Result {
        return cast(JSON.parse(json), r("Result"));
    }

    public static resultToJson(value: Result): string {
        return JSON.stringify(uncast(value, r("Result")), null, 2);
    }
    public static toEnheter(json: string): Enheter {
        return cast(JSON.parse(json), r("Enheter"));
    }

    public static enheterToJson(value: Enheter): string {
        return JSON.stringify(uncast(value, r("Enheter")), null, 2);
    }
}

function invalidValue(typ: any, val: any): never {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        var map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(typ: any, val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(typ, val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Result": o([
        { json: "_embedded", js: "_embedded", typ: u(undefined, r("Embedded")) },
        { json: "_links", js: "_links", typ: u(undefined, r("ResultLinks")) },
        { json: "page", js: "page", typ: u(undefined, r("Page")) },
    ], false),
    "Embedded": o([
        { json: "enheter", js: "enheter", typ: u(undefined, a(r("Enheter"))) },
    ], false),
    "Enheter": o([
        { json: "organisasjonsnummer", js: "organisasjonsnummer", typ: u(undefined, "") },
        { json: "navn", js: "navn", typ: u(undefined, "") },
        { json: "organisasjonsform", js: "organisasjonsform", typ: u(undefined, r("Organisasjonsform")) },
        { json: "registreringsdatoEnhetsregisteret", js: "registreringsdatoEnhetsregisteret", typ: u(undefined, Date) },
        { json: "registrertIMvaregisteret", js: "registrertIMvaregisteret", typ: u(undefined, true) },
        { json: "naeringskode1", js: "naeringskode1", typ: u(undefined, r("InstitusjonellSektorkode")) },
        { json: "antallAnsatte", js: "antallAnsatte", typ: u(undefined, 0) },
        { json: "forretningsadresse", js: "forretningsadresse", typ: u(undefined, r("Forretningsadresse")) },
        { json: "stiftelsesdato", js: "stiftelsesdato", typ: u(undefined, Date) },
        { json: "institusjonellSektorkode", js: "institusjonellSektorkode", typ: u(undefined, r("InstitusjonellSektorkode")) },
        { json: "registrertIForetaksregisteret", js: "registrertIForetaksregisteret", typ: u(undefined, true) },
        { json: "registrertIStiftelsesregisteret", js: "registrertIStiftelsesregisteret", typ: u(undefined, true) },
        { json: "registrertIFrivillighetsregisteret", js: "registrertIFrivillighetsregisteret", typ: u(undefined, true) },
        { json: "sisteInnsendteAarsregnskap", js: "sisteInnsendteAarsregnskap", typ: u(undefined, "") },
        { json: "konkurs", js: "konkurs", typ: u(undefined, true) },
        { json: "underAvvikling", js: "underAvvikling", typ: u(undefined, true) },
        { json: "underTvangsavviklingEllerTvangsopplosning", js: "underTvangsavviklingEllerTvangsopplosning", typ: u(undefined, true) },
        { json: "maalform", js: "maalform", typ: u(undefined, r("Maalform")) },
        { json: "lat", js: "lat", typ: u(undefined, 3.14) },
        { json: "lng", js: "lng", typ: u(undefined, 3.14) },
        { json: "_links", js: "_links", typ: u(undefined, r("EnheterLinks")) },
        { json: "frivilligMvaRegistrertBeskrivelser", js: "frivilligMvaRegistrertBeskrivelser", typ: u(undefined, a("")) },
    ], false),
    "EnheterLinks": o([
        { json: "self", js: "self", typ: u(undefined, r("First")) },
    ], false),
    "First": o([
        { json: "href", js: "href", typ: u(undefined, "") },
    ], false),
    "Forretningsadresse": o([
        { json: "land", js: "land", typ: u(undefined, r("Land")) },
        { json: "landkode", js: "landkode", typ: u(undefined, r("Landkode")) },
        { json: "postnummer", js: "postnummer", typ: u(undefined, "") },
        { json: "poststed", js: "poststed", typ: u(undefined, "") },
        { json: "adresse", js: "adresse", typ: u(undefined, a("")) },
        { json: "kommune", js: "kommune", typ: u(undefined, "") },
        { json: "kommunenummer", js: "kommunenummer", typ: u(undefined, "") },
    ], false),
    "InstitusjonellSektorkode": o([
        { json: "kode", js: "kode", typ: u(undefined, "") },
        { json: "beskrivelse", js: "beskrivelse", typ: u(undefined, "") },
    ], false),
    "Organisasjonsform": o([
        { json: "kode", js: "kode", typ: u(undefined, r("Kode")) },
        { json: "beskrivelse", js: "beskrivelse", typ: u(undefined, r("Beskrivelse")) },
        { json: "_links", js: "_links", typ: u(undefined, r("EnheterLinks")) },
    ], false),
    "ResultLinks": o([
        { json: "first", js: "first", typ: u(undefined, r("First")) },
        { json: "self", js: "self", typ: u(undefined, r("First")) },
        { json: "next", js: "next", typ: u(undefined, r("First")) },
        { json: "last", js: "last", typ: u(undefined, r("First")) },
    ], false),
    "Page": o([
        { json: "size", js: "size", typ: u(undefined, 0) },
        { json: "totalElements", js: "totalElements", typ: u(undefined, 0) },
        { json: "totalPages", js: "totalPages", typ: u(undefined, 0) },
        { json: "number", js: "number", typ: u(undefined, 0) },
    ], false),
    "Land": [
        "Norge",
    ],
    "Landkode": [
        "NO",
    ],
    "Maalform": [
        "Bokmål",
    ],
    "Beskrivelse": [
        "Aksjeselskap",
    ],
    "Kode": [
        "AS",
    ],
};
