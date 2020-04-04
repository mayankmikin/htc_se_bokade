// To parse this data:
//
//   import { Convert, Store } from "./file";
//
//   const store = Convert.toStore(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export class Store {
    organisasjonsnummer?:                       string;
    navn?:                                      string;
    organisasjonsform?:                         Organisasjonsform;
    hjemmeside?:                                string;
    postadresse?:                               Adresse;
    registreringsdatoEnhetsregisteret?:         Date;
    registrertIMvaregisteret?:                  boolean;
    naeringskode1?:                             InstitusjonellSektorkode;
    antallAnsatte?:                             number;
    forretningsadresse?:                        Adresse;
    stiftelsesdato?:                            Date;
    institusjonellSektorkode?:                  InstitusjonellSektorkode;
    registrertIForetaksregisteret?:             boolean;
    registrertIStiftelsesregisteret?:           boolean;
    registrertIFrivillighetsregisteret?:        boolean;
    sisteInnsendteAarsregnskap?:                string;
    konkurs?:                                   boolean;
    underAvvikling?:                            boolean;
    underTvangsavviklingEllerTvangsopplosning?: boolean;
    maalform?:                                  string;
    links?:                                     Links;
    lat?:                                       number;
    long?:                                      number;
    time?:                                      Time;
    maxpeopleallowed?:                          number;
    maxtimeallowed?:                            number;
    currentpeoplecount?:                        number;
    buffercount?:                               number;
    calendar?:                                  Calendar[];
}

export class Calendar {
    currentMonth?: TMonth[]=[];
    nextMonth?:    TMonth[]=[];
}

export class TMonth {
    day?:   number;
    slots?: Slot[]=[];
}

export class Slot {
    slot?:         number;
    bookingcount?: number;
    availability?: number;
}

export interface Adresse {
    land?:          string;
    landkode?:      string;
    postnummer?:    string;
    poststed?:      string;
    adresse?:       string[];
    kommune?:       string;
    kommunenummer?: string;
}

export interface InstitusjonellSektorkode {
    kode?:        string;
    beskrivelse?: string;
}

export interface Links {
    self?: Self;
}

export interface Self {
    href?: string;
}

export interface Organisasjonsform {
    kode?:        string;
    beskrivelse?: string;
    links?:       Links;
}

export class Time {
    open?:  Close;
    close?: Close;
}

export class Close {
    hour?:   number;
    minute?: number;
    period?: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toStore(json: string): Store {
        return cast(JSON.parse(json), r("Store"));
    }

    public static storeToJson(value: Store): string {
        return JSON.stringify(uncast(value, r("Store")), null, 2);
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
    "Store": o([
        { json: "organisasjonsnummer", js: "organisasjonsnummer", typ: u(undefined, "") },
        { json: "navn", js: "navn", typ: u(undefined, "") },
        { json: "organisasjonsform", js: "organisasjonsform", typ: u(undefined, r("Organisasjonsform")) },
        { json: "hjemmeside", js: "hjemmeside", typ: u(undefined, "") },
        { json: "postadresse", js: "postadresse", typ: u(undefined, r("Adresse")) },
        { json: "registreringsdatoEnhetsregisteret", js: "registreringsdatoEnhetsregisteret", typ: u(undefined, Date) },
        { json: "registrertIMvaregisteret", js: "registrertIMvaregisteret", typ: u(undefined, true) },
        { json: "naeringskode1", js: "naeringskode1", typ: u(undefined, r("InstitusjonellSektorkode")) },
        { json: "antallAnsatte", js: "antallAnsatte", typ: u(undefined, 0) },
        { json: "forretningsadresse", js: "forretningsadresse", typ: u(undefined, r("Adresse")) },
        { json: "stiftelsesdato", js: "stiftelsesdato", typ: u(undefined, Date) },
        { json: "institusjonellSektorkode", js: "institusjonellSektorkode", typ: u(undefined, r("InstitusjonellSektorkode")) },
        { json: "registrertIForetaksregisteret", js: "registrertIForetaksregisteret", typ: u(undefined, true) },
        { json: "registrertIStiftelsesregisteret", js: "registrertIStiftelsesregisteret", typ: u(undefined, true) },
        { json: "registrertIFrivillighetsregisteret", js: "registrertIFrivillighetsregisteret", typ: u(undefined, true) },
        { json: "sisteInnsendteAarsregnskap", js: "sisteInnsendteAarsregnskap", typ: u(undefined, "") },
        { json: "konkurs", js: "konkurs", typ: u(undefined, true) },
        { json: "underAvvikling", js: "underAvvikling", typ: u(undefined, true) },
        { json: "underTvangsavviklingEllerTvangsopplosning", js: "underTvangsavviklingEllerTvangsopplosning", typ: u(undefined, true) },
        { json: "maalform", js: "maalform", typ: u(undefined, "") },
        { json: "_links", js: "links", typ: u(undefined, r("Links")) },
        { json: " lat ", js: "lat", typ: u(undefined, 3.14) },
        { json: "long", js: "long", typ: u(undefined, 0) },
        { json: "time", js: "time", typ: u(undefined, r("Time")) },
        { json: "maxpeopleallowed", js: "maxpeopleallowed", typ: u(undefined, 0) },
        { json: "maxtimeallowed", js: "maxtimeallowed", typ: u(undefined, 0) },
        { json: "currentpeoplecount", js: "currentpeoplecount", typ: u(undefined, 0) },
        { json: "buffercount", js: "buffercount", typ: u(undefined, 0) },
        { json: "calendar", js: "calendar", typ: u(undefined, a(r("Calendar"))) },
    ], false),
    "Calendar": o([
        { json: "currentMonth", js: "currentMonth", typ: u(undefined, a(r("TMonth"))) },
        { json: "nextMonth", js: "nextMonth", typ: u(undefined, a(r("TMonth"))) },
    ], false),
    "TMonth": o([
        { json: "day", js: "day", typ: u(undefined, 0) },
        { json: "slots", js: "slots", typ: u(undefined, a(r("Slot"))) },
    ], false),
    "Slot": o([
        { json: "slot", js: "slot", typ: u(undefined, 0) },
        { json: "bookingcount", js: "bookingcount", typ: u(undefined, 0) },
        { json: "availability", js: "availability", typ: u(undefined, 0) },
    ], false),
    "Adresse": o([
        { json: "land", js: "land", typ: u(undefined, "") },
        { json: "landkode", js: "landkode", typ: u(undefined, "") },
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
    "Links": o([
        { json: "self", js: "self", typ: u(undefined, r("Self")) },
    ], false),
    "Self": o([
        { json: "href", js: "href", typ: u(undefined, "") },
    ], false),
    "Organisasjonsform": o([
        { json: "kode", js: "kode", typ: u(undefined, "") },
        { json: "beskrivelse", js: "beskrivelse", typ: u(undefined, "") },
        { json: "_links", js: "links", typ: u(undefined, r("Links")) },
    ], false),
    "Time": o([
        { json: "open", js: "open", typ: u(undefined, r("Close")) },
        { json: "close", js: "close", typ: u(undefined, r("Close")) },
    ], false),
    "Close": o([
        { json: "hour", js: "hour", typ: u(undefined, 0) },
        { json: "minute", js: "minute", typ: u(undefined, 0) },
        { json: "period", js: "period", typ: u(undefined, 0) },
        
    ], false),
};
