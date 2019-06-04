type PublicKey = string;
export class Organization {
    private _name?:string;
    private _dba?: string;
    private _url?: string;
    private _logo?: string;
    private _description?: string;
    private _physicalAddress?: string;
    private _physicalAddressAttestation?: string;
    private _phoneNumber?: string;
    private _phoneNumberAttestation?:string;
    private _keybase?: string;
    private _twitter?: string;
    private _github?: string;
    private _officialEmail?: string;
    private _validators: PublicKey[] = [];

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get dba() {
        return this._dba;
    }

    set dba(value) {
        this._dba = value;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get logo() {
        return this._logo;
    }

    set logo(value) {
        this._logo = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get physicalAddress() {
        return this._physicalAddress;
    }

    set physicalAddress(value) {
        this._physicalAddress = value;
    }

    get physicalAddressAttestation() {
        return this._physicalAddressAttestation;
    }

    set physicalAddressAttestation(value) {
        this._physicalAddressAttestation = value;
    }

    get phoneNumber() {
        return this._phoneNumber;
    }

    set phoneNumber(value) {
        this._phoneNumber = value;
    }

    get phoneNumberAttestation() {
        return this._phoneNumberAttestation;
    }

    set phoneNumberAttestation(value) {
        this._phoneNumberAttestation = value;
    }

    get keybase() {
        return this._keybase;
    }

    set keybase(value) {
        this._keybase = value;
    }

    get twitter() {
        return this._twitter;
    }

    set twitter(value) {
        this._twitter = value;
    }

    get github() {
        return this._github;
    }

    set github(value) {
        this._github = value;
    }

    get officialEmail() {
        return this._officialEmail;
    }

    set officialEmail(value) {
        this._officialEmail = value;
    }

    get validators(): PublicKey[] {
        return this._validators;
    }

    set validators(value: PublicKey[]) {
        this._validators = value;
    }

    public toJSON() :Object {
        return {
            name: this.name,
            dba: this.dba,
            url: this.url,
            logo: this.logo,
            description: this.description,
            physicalAddress: this.physicalAddress,
            physicalAddressAttestation: this.physicalAddressAttestation,
            phoneNumber: this.phoneNumber,
            phoneNumberAttestation: this.phoneNumberAttestation,
            keybase: this.keybase,
            twitter: this.twitter,
            github: this.github,
            officialEmail: this.officialEmail,
            validators: this.validators
        }
    }


    static fromJSON(organization:string|Object):Organization {
        if(organization === undefined) {
            return new Organization();
        }

        let organizationObject:any;

        if(typeof organization === 'string') {
            organizationObject = JSON.parse(organization);
        } else
            organizationObject = organization;

        let newOrganization = new Organization();
        newOrganization.name=organizationObject.name;
        newOrganization.dba=organizationObject.dba;
        newOrganization.url=organizationObject.url;
        newOrganization.logo=organizationObject.logo;
        newOrganization.description=organizationObject.description;
        newOrganization.physicalAddress=organizationObject.physicalAddress;
        newOrganization.physicalAddressAttestation=organizationObject.physicalAddressAttestation;
        newOrganization.phoneNumber=organizationObject.phoneNumber;
        newOrganization.phoneNumberAttestation=organizationObject.phoneNumberAttestation;
        newOrganization.keybase=organizationObject.keybase;
        newOrganization.twitter=organizationObject.twitter;
        newOrganization.github=organizationObject.github;
        newOrganization.officialEmail=organizationObject.officialEmail;
        newOrganization.validators=organizationObject.validators;

        return newOrganization;
    }
}