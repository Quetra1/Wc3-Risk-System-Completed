import { NEUTRAL_HOSTILE } from "resources/constants";
import { UID } from "resources/unitID";
import { UTYPE } from "resources/unitTypes";
import { FilterFriendlyValidGuards, FilterOwnedGuards, isGuardValid } from "./guard-filters";
import { compareValue } from "./guard-options";
import { File } from "w3ts";
import { TransportManager } from "app/transports/transport-manager";

export const Cities: City[] = [];
export const CityRegionSize: number = 185;

export const enterCityTrig: trigger = CreateTrigger();
export const leaveCityTrig: trigger = CreateTrigger();
export const unitTrainedTrig: trigger = CreateTrigger();

export class City {
	private _barrack: unit;
	private cop: unit;
	private _guard: unit;
	private region: region;
	private _x: number;
	private _y: number;
	private defaultGuardType: number;
	private defaultBarrackType: number;
	public counter: number;
	public counter2: number;
	public static fromBarrack = new Map<unit, City>();
	public static fromGuard = new Map<unit, City>();
	public static fromRegion = new Map<region, City>();
	public static cities: City[] = [];

	constructor(x: number, y: number, barrackType: number, name?: string, guardType: number = UID.RIFLEMEN) {
		this.defaultBarrackType = barrackType;
		this.setBarrack(x, y, name);

		//Create region
		const offSetX: number = x - 125;
		const offSetY: number = y - 255;

		let rect = Rect(
			offSetX - CityRegionSize / 2,
			offSetY - CityRegionSize / 2,
			offSetX + CityRegionSize / 2,
			offSetY + CityRegionSize / 2
		);
		this._x = GetRectCenterX(rect);
		this._y = GetRectCenterY(rect);
		this.counter = 0;
		this.counter2 = 0;
		this.region = CreateRegion();
		RegionAddRect(this.region, rect);
		RemoveRect(rect);
		City.fromRegion.set(this.region, this);

		TriggerRegisterEnterRegion(enterCityTrig, this.region, null);
		TriggerRegisterLeaveRegion(leaveCityTrig, this.region, null);
		//TODO: Refactor so I can rebuild cities
		TriggerRegisterUnitEvent(unitTrainedTrig, this.barrack, EVENT_UNIT_TRAIN_FINISH);

		let trigg = CreateTrigger()
		TriggerRegisterPlayerSelectionEventBJ(trigg, Player(0), true)

		// TriggerAddAction(trigg, () => {
		// 	if (IsUnitType(GetTriggerUnit(), UTYPE.CITY)) {
		// 		this.counter = this.counter + 1;
		// 		File.write("city" + this.counter.toString() + ".pld", "Cities[0] = new City(" + GetUnitX(GetTriggerUnit()).toString() + ", " + GetUnitY(GetTriggerUnit()).toString() + ", UID.CITY)");
		// 	}
		// 	if (IsUnitType(GetTriggerUnit(), UTYPE.SPAWN)) {
		// 		this.counter2 = this.counter2 + 1;
		// 		File.write("country" + this.counter2.toString() + ".pld", "Country.fromName.set(, new Country(, " + GetUnitX(GetTriggerUnit()).toString() + ", " + GetUnitY(GetTriggerUnit()).toString() + "))");
		// 	}

		// })

		//Create cop
		this.cop = CreateUnit(NEUTRAL_HOSTILE, UID.CONTROL_POINT, offSetX, offSetY, 270);

		this.defaultGuardType = guardType;
		this.setGuard(guardType);

		rect = null;
	}

	//Static API
	public static init() {

		//Jordan
		Cities[0] = new City(-17408.0, 3520.0, UID.CITY)
		Cities[1] = new City(-16448.0, 4416.0, UID.CITY)
		//Mozambique
		Cities[2] = new City(-17472.0, -13888.0, UID.CITY)
		Cities[3] = new City(-16448.0, -12736.0, UID.CITY)
		Cities[4] = new City(-16480.0, -15008.0, UID.PORT)

		//Tanzania
		Cities[5] = new City(-17152.0, -10304.0, UID.CITY)
		Cities[6] = new City(-16000.0, -11264.0, UID.CITY)

		//Kenya
		Cities[7] = new City(-15488.0, -9152.0, UID.CITY)
		Cities[8] = new City(-17216.0, -8192.0, UID.CITY)

		//Somalia
		Cities[9] = new City(-14016.0, -8640.0, UID.PORT)
		Cities[10] = new City(-12800.0, -7488.0, UID.CITY)
		Cities[11] = new City(-11872.0, -5408.0, UID.PORT)

		//Taiwan
		Cities[12] = new City(10528.0, 1056.0, UID.PORT)
		Cities[13] = new City(10624.0, 2688.0, UID.CITY)

		//South Ethiopia
		Cities[14] = new City(-16192.0, -7104.0, UID.CITY)
		Cities[15] = new City(-14784.0, -6400.0, UID.CITY)
		Cities[16] = new City(-16960.0, -6016.0, UID.CITY)

		//North Ethiopia
		Cities[17] = new City(-15424.0, -3264.0, UID.CITY)
		Cities[18] = new City(-16000.0, -4224.0, UID.CITY)
		Cities[19] = new City(-13856.0, -4896.0, UID.CITY)

		//Sudan
		Cities[20] = new City(-17344.0, -3648.0, UID.CITY)
		Cities[21] = new City(-16384.0, -2112.0, UID.CITY)

		//Saudi Arabia
		Cities[22] = new City(-15936.0, 1536.0, UID.CITY)
		Cities[23] = new City(-14848.0, 2112.0, UID.CITY)
		Cities[24] = new City(-13760.0, 256.0, UID.CITY)
		Cities[25] = new City(-15168.0, 448.0, UID.CITY)
		Cities[26] = new City(-14144.0, -896.0, UID.CITY)

		//Iraq
		Cities[27] = new City(-15104.0, 4864.0, UID.CITY)
		Cities[28] = new City(-14528.0, 6336.0, UID.CITY)

		//Syria
		Cities[29] = new City(-17344.0, 5184.0, UID.CITY)
		Cities[30] = new City(-16256.0, 6080.0, UID.CITY)

		//Turkey
		Cities[31] = new City(-17472.0, 8448.0, UID.CITY)
		Cities[32] = new City(-16192.0, 7744.0, UID.CITY)
		Cities[33] = new City(-15104.0, 8640.0, UID.CITY)

		//Georgia
		Cities[34] = new City(-14784.0, 10048.0, UID.CITY)
		Cities[35] = new City(-13760.0, 9344.0, UID.CITY)

		//South Russia
		Cities[36] = new City(-12608.0, 11328.0, UID.CITY)
		Cities[37] = new City(-14848.0, 12224.0, UID.CITY)
		Cities[38] = new City(-14912.0, 14912.0, UID.CITY)
		Cities[39] = new City(-17024.0, 15744.0, UID.CITY)

		//Ukraine
		Cities[40] = new City(-16320.0, 13824.0, UID.CITY)
		Cities[41] = new City(-17408.0, 13120.0, UID.CITY)

		//East Malaysia
		Cities[42] = new City(8128.0, -10752.0, UID.CITY)
		Cities[43] = new City(10112.0, -8064.0, UID.CITY)
		Cities[44] = new City(8736.0, -9120.0, UID.PORT)

		//Lower Indonesia
		Cities[45] = new City(7136.0, -14944.0, UID.PORT)
		Cities[46] = new City(9216.0, -15424.0, UID.CITY)

		//Bhutan
		Cities[47] = new City(0.0, 1408.0, UID.CITY)
		//North East India
		Cities[48] = new City(1088.0, 576.0, UID.CITY)
		Cities[49] = new City(1984.0, 1920.0, UID.CITY)
		//Nepal
		Cities[50] = new City(-2432.0, 1664.0, UID.CITY)
		Cities[51] = new City(-1344.0, 1088.0, UID.CITY)
		//Tibet (China)
		Cities[52] = new City(1664.0, 3392.0, UID.CITY)
		Cities[53] = new City(192.0, 3712.0, UID.CITY)
		Cities[54] = new City(-1344.0, 3328.0, UID.CITY)
		Cities[55] = new City(-1152.0, 4928.0, UID.CITY)
		Cities[56] = new City(-2560.0, 4544.0, UID.CITY)

		//West Malaysia
		Cities[57] = new City(4288.0, -9152.0, UID.CITY)
		Cities[58] = new City(5280.0, -10144.0, UID.PORT)

		//Yunnan (China)
		Cities[59] = new City(3456.0, 1344.0, UID.CITY)
		Cities[60] = new City(4608.0, 576.0, UID.CITY)

		//South Korea
		Cities[61] = new City(11072.0, 9728.0, UID.CITY)

		//North Korea
		Cities[62] = new City(9920.0, 10560.0, UID.CITY)
		Cities[63] = new City(10240.0, 12352.0, UID.PORT)

		//Russia Far East
		Cities[64] = new City(8576.0, 16064.0, UID.CITY)
		Cities[65] = new City(10112.0, 16064.0, UID.CITY)

		//Japan
		Cities[66] = new City(12384.0, 7584.0, UID.PORT)
		Cities[67] = new City(12992.0, 9216.0, UID.CITY)
		Cities[68] = new City(14144.0, 11136.0, UID.CITY)
		Cities[69] = new City(13632.0, 13376.0, UID.CITY)

		//Sapporo (Japan)
		Cities[70] = new City(13632.0, 16064.0, UID.CITY)
		Cities[71] = new City(14496.0, 15584.0, UID.PORT)

		//North Philippines
		Cities[72] = new City(10848.0, -224.0, UID.PORT)
		Cities[73] = new City(11072.0, -1728.0, UID.CITY)
		//South Philippines
		Cities[74] = new City(13440.0, -4736.0, UID.CITY)
		Cities[75] = new City(13216.0, -6048.0, UID.PORT)

		//Inner Mongolia
		Cities[76] = new City(2816.0, 8384.0, UID.CITY)
		Cities[77] = new City(4288.0, 8640.0, UID.CITY)
		Cities[78] = new City(6016.0, 10432.0, UID.CITY)

		//South Xinjiang (China)
		Cities[79] = new City(-3584.0, 5760.0, UID.CITY)
		Cities[80] = new City(-2816.0, 6976.0, UID.CITY)
		Cities[81] = new City(-1920.0, 6016.0, UID.CITY)

		//North Xinjiang (China)
		Cities[82] = new City(-1728.0, 8640.0, UID.CITY)
		Cities[83] = new City(-832.0, 9664.0, UID.CITY)
		Cities[84] = new City(256.0, 8576.0, UID.CITY)
		Cities[85] = new City(-768.0, 7488.0, UID.CITY)

		//Mongolia
		Cities[86] = new City(5696.0, 12672.0, UID.CITY)
		Cities[87] = new City(4352.0, 13184.0, UID.CITY)
		Cities[88] = new City(2304.0, 12736.0, UID.CITY)
		Cities[89] = new City(1088.0, 11584.0, UID.CITY)
		Cities[90] = new City(1920.0, 10176.0, UID.CITY)
		Cities[91] = new City(3840.0, 10496.0, UID.CITY)

		//North China
		Cities[92] = new City(8000.0, 11584.0, UID.CITY)
		Cities[93] = new City(9024.0, 13248.0, UID.CITY)
		Cities[94] = new City(7296.0, 13952.0, UID.CITY)
		Cities[95] = new City(7456.0, 10144.0, UID.PORT)

		//Central China
		Cities[96] = new City(1600.0, 4800.0, UID.CITY)
		Cities[97] = new City(576.0, 6080.0, UID.CITY)
		Cities[98] = new City(1792.0, 6528.0, UID.CITY)
		Cities[99] = new City(2816.0, 5568.0, UID.CITY)

		//South India
		Cities[100] = new City(-4864.0, -5888.0, UID.CITY)
		Cities[101] = new City(-3136.0, -5952.0, UID.CITY)
		Cities[102] = new City(-3968.0, -7296.0, UID.CITY)
		Cities[103] = new City(-5344.0, -4768.0, UID.PORT)
		Cities[104] = new City(-2848.0, -4576.0, UID.PORT)

		//Sri Lanka
		Cities[105] = new City(-2208.0, -10976.0, UID.PORT)
		Cities[106] = new City(-3072.0, -9664.0, UID.CITY)

		//Central India
		Cities[107] = new City(-4992.0, -3008.0, UID.CITY)
		Cities[108] = new City(-4352.0, -832.0, UID.CITY)
		Cities[109] = new City(-1664.0, -2368.0, UID.CITY)
		Cities[110] = new City(-3136.0, -3008.0, UID.CITY)
		Cities[111] = new City(-2880.0, -1664.0, UID.CITY)

		//West India
		Cities[112] = new City(-6464.0, -512.0, UID.CITY)
		Cities[113] = new City(-5440.0, 512.0, UID.CITY)

		//Pradesh
		Cities[114] = new City(-4608.0, 1472.0, UID.CITY)
		Cities[115] = new City(-3136.0, 256.0, UID.CITY)

		//North India
		Cities[116] = new City(-4096.0, 4032.0, UID.CITY)
		Cities[117] = new City(-3648.0, 2688.0, UID.CITY)
		//East China
		Cities[118] = new City(5888.0, 4544.0, UID.CITY)
		Cities[119] = new City(8256.0, 4480.0, UID.CITY)
		Cities[120] = new City(4736.0, 2752.0, UID.CITY)
		Cities[121] = new City(6848.0, 704.0, UID.CITY)
		Cities[122] = new City(8384.0, 2496.0, UID.CITY)

		//Shandong
		Cities[123] = new City(7808.0, 7360.0, UID.CITY)
		Cities[124] = new City(6592.0, 8384.0, UID.CITY)
		Cities[125] = new City(5696.0, 6912.0, UID.CITY)

		//Pakistan
		Cities[126] = new City(-7808.0, 1792.0, UID.CITY)
		Cities[127] = new City(-6208.0, 2496.0, UID.CITY)
		Cities[128] = new City(-5760.0, 4032.0, UID.CITY)

		//North Iran
		Cities[129] = new City(-12608.0, 5120.0, UID.CITY)
		Cities[130] = new City(-11968.0, 6336.0, UID.CITY)
		Cities[131] = new City(-11136.0, 4928.0, UID.CITY)
		Cities[132] = new City(-10176.0, 5696.0, UID.CITY)

		//South Iran
		Cities[133] = new City(-10016.0, 1824.0, UID.PORT)
		Cities[134] = new City(-12032.0, 2432.0, UID.CITY)
		Cities[135] = new City(-10112.0, 3200.0, UID.CITY)

		//Azerbaijan
		Cities[136] = new City(-13056.0, 8000.0, UID.CITY)
		Cities[137] = new City(-12160.0, 8960.0, UID.CITY)

		//Afghanistan
		Cities[138] = new City(-8640.0, 3904.0, UID.CITY)
		Cities[139] = new City(-7296.0, 4096.0, UID.CITY)
		Cities[140] = new City(-8064.0, 5312.0, UID.CITY)
		Cities[141] = new City(-6656.0, 5568.0, UID.CITY)

		//Turkmenistan
		Cities[142] = new City(-8768.0, 7296.0, UID.CITY)
		Cities[143] = new City(-9728.0, 8448.0, UID.CITY)

		//Uzbekistan
		Cities[144] = new City(-7552.0, 8320.0, UID.CITY)
		Cities[145] = new City(-8512.0, 9728.0, UID.CITY)

		//Tajikistan
		Cities[146] = new City(-5056.0, 6848.0, UID.CITY)
		Cities[147] = new City(-7168.0, 6912.0, UID.CITY)

		//Kryg
		Cities[148] = new City(-5120.0, 8128.0, UID.CITY)
		Cities[149] = new City(-3904.0, 8320.0, UID.CITY)

		//East Kazakhstan
		Cities[150] = new City(-5824.0, 10496.0, UID.CITY)
		Cities[151] = new City(-6464.0, 11968.0, UID.CITY)
		Cities[152] = new City(-4032.0, 10304.0, UID.CITY)
		Cities[153] = new City(-4928.0, 13184.0, UID.CITY)
		Cities[154] = new City(-3776.0, 11904.0, UID.CITY)
		Cities[155] = new City(-2112.0, 11520.0, UID.CITY)

		//Mangystau (Kazakhstan)
		Cities[156] = new City(-10624.0, 9792.0, UID.CITY)
		Cities[157] = new City(-10752.0, 10880.0, UID.CITY)

		//West Kazakhstan
		Cities[158] = new City(-8320.0, 12160.0, UID.CITY)
		Cities[159] = new City(-9216.0, 13312.0, UID.CITY)
		Cities[160] = new City(-10944.0, 13376.0, UID.CITY)

		//Hainan (China)
		Cities[161] = new City(7136.0, -1504.0, UID.PORT)

		//Volga (Russia)
		Cities[162] = new City(-13120.0, 14976.0, UID.CITY)
		Cities[163] = new City(-12160.0, 16064.0, UID.CITY)

		//Ural (Russia)
		Cities[164] = new City(-11264.0, 15232.0, UID.CITY)
		Cities[165] = new City(-9856.0, 14976.0, UID.CITY)
		Cities[166] = new City(-9088.0, 16000.0, UID.CITY)

		//Central Russia
		Cities[167] = new City(-7616.0, 14528.0, UID.CITY)
		Cities[168] = new City(-7296.0, 16064.0, UID.CITY)
		Cities[169] = new City(-5568.0, 16064.0, UID.CITY)

		//Siberia
		Cities[170] = new City(-1856.0, 14848.0, UID.CITY)
		Cities[171] = new City(384.0, 14144.0, UID.CITY)
		Cities[172] = new City(64.0, 15872.0, UID.CITY)

		//Eastern Russia
		Cities[173] = new City(3072.0, 14720.0, UID.CITY)
		Cities[174] = new City(3904.0, 15936.0, UID.CITY)
		Cities[175] = new City(5184.0, 15488.0, UID.CITY)

		//Cambodia
		Cities[176] = new City(5344.0, -6688.0, UID.PORT)
		Cities[177] = new City(5888.0, -5376.0, UID.CITY)
		Cities[178] = new City(7104.0, -4864.0, UID.CITY)

		//Thailand
		Cities[179] = new City(4352.0, -5248.0, UID.CITY)
		Cities[180] = new City(4736.0, -3904.0, UID.CITY)
		Cities[181] = new City(3584.0, -2880.0, UID.CITY)

		//Myanmar
		Cities[182] = new City(2272.0, -3488.0, UID.PORT)
		Cities[183] = new City(1792.0, -1216.0, UID.CITY)
		Cities[184] = new City(3072.0, -1728.0, UID.CITY)

		//Bangladesh
		Cities[185] = new City(352.0, -1312.0, UID.PORT)
		Cities[186] = new City(-192.0, -320.0, UID.CITY)

		//Vietnam
		Cities[187] = new City(5504.0, -1536.0, UID.CITY)
		Cities[188] = new City(5248.0, -384.0, UID.CITY)

		//Laos
		Cities[189] = new City(6272.0, -3712.0, UID.CITY)
		Cities[190] = new City(4736.0, -2368.0, UID.CITY)

		//Yemen
		Cities[191] = new City(-12256.0, -3040.0, UID.PORT)
		Cities[192] = new City(-13760.0, -2432.0, UID.CITY)

		//Oman
		Cities[193] = new City(-10400.0, -480.0, UID.PORT)
		Cities[194] = new City(-11200.0, -2048.0, UID.CITY)

		//UAE
		Cities[195] = new City(-12352.0, 64.0, UID.CITY)
		Cities[196] = new City(-11264.0, 192.0, UID.CITY)

		//Madagascar
		Cities[197] = new City(-13184.0, -14656.0, UID.PORT)
		Cities[198] = new City(-12672.0, -13376.0, UID.CITY)
		Cities[199] = new City(-11872.0, -12192.0, UID.PORT)
		//West Indonesia
		Cities[200] = new City(2624.0, -10432.0, UID.PORT)
		Cities[201] = new City(3968.0, -11456.0, UID.CITY)
		Cities[202] = new City(5056.0, -12800.0, UID.CITY)
		Cities[203] = new City(5760.0, -13824.0, UID.CITY)

		//East Timor
		Cities[204] = new City(12512.0, -15392.0, UID.PORT)
		Cities[205] = new City(13696.0, -14144.0, UID.CITY)

		//Central Indonesia
		Cities[206] = new City(8384.0, -12096.0, UID.CITY)
		Cities[207] = new City(9728.0, -11392.0, UID.CITY)
		Cities[209] = new City(10496.0, -9728.0, UID.CITY)
		//East Indonesia
		Cities[210] = new City(12256.0, -10400.0, UID.PORT)
		Cities[211] = new City(12224.0, -11968.0, UID.CITY)

		//Kuwait
		Cities[212] = new City(-14016.0, 3328.0, UID.CITY)
		Cities[213] = new City(-14080.0, 4480.0, UID.CITY)
		this.onEnter();
		this.onLeave();
		this.onTrain();
	}

	public static onCast() {
		let trigUnit: unit = GetTriggerUnit();
		let targUnit: unit = GetSpellTargetUnit();
		const city: City = City.fromBarrack.get(trigUnit);

		if (!city.isPort() && IsUnitType(targUnit, UTYPE.SHIP)) return false;

		if (
			(IsUnitType(city.guard, UTYPE.SHIP) &&
				IsTerrainPathable(GetUnitX(targUnit), GetUnitY(targUnit), PATHING_TYPE_FLOATABILITY)) ||
			(!IsUnitType(city.guard, UTYPE.SHIP) &&
				IsTerrainPathable(GetUnitX(targUnit), GetUnitY(targUnit), PATHING_TYPE_WALKABILITY))
		) {
			city.changeGuard(targUnit);
		} else {
			let oldGuard: unit = city.guard;
			let x: number = GetUnitX(targUnit);
			let y: number = GetUnitY(targUnit);

			city.changeGuard(targUnit);
			SetUnitPosition(oldGuard, x, y);
			SetUnitPosition(city.guard, city.x, city.y);

			oldGuard = null;
		}

		city.setOwner(GetOwningPlayer(targUnit));
		trigUnit = null;
		targUnit = null;

		return false;
	}

	//Public API
	public get barrack(): unit {
		return this._barrack;
	}

	public get guard(): unit {
		return this._guard;
	}

	public get x(): number {
		return this._x;
	}
	public get y(): number {
		return this._y;
	}

	public isPort(): boolean {
		return GetUnitTypeId(this.barrack) == UID.PORT;
	}

	public isGuardShip(): boolean {
		return IsUnitType(this.guard, UTYPE.SHIP);
	}

	public isGuardDummy(): boolean {
		return GetUnitTypeId(this.guard) == UID.DUMMY_GUARD;
	}

	public getOwner(): player {
		return GetOwningPlayer(this.barrack);
	}

	public reset() {
		this.setOwner(NEUTRAL_HOSTILE);
		this.removeGuard(true);
		this.setGuard(this.defaultGuardType);
	}

	// public reset() {
	// 	const x: number = GetUnitX(this.barrack);
	// 	const y: number = GetUnitY(this.barrack);
	// 	const name: string = GetUnitName(this.barrack);

	// 	City.fromBarrack.delete(this.barrack);
	// 	RemoveUnit(this.barrack);
	// 	this._barrack = null;
	// 	this.setBarrack(x, y, name);
	// 	this.removeGuard(true);
	// 	this.setGuard(this.defaultGuardType);
	// }

	public changeGuardOwner() {
		SetUnitOwner(this._guard, this.getOwner(), true);
	}

	//removed full change boolean - never changes guard
	//removed reset rally boolean - always resets now
	//removed change color boolean - always change color
	//Previously updateOwner & changeOwner
	public setOwner(newOwner: player) {
		if (this.getOwner() == newOwner) return false;

		SetUnitOwner(this.barrack, newOwner, true);
		SetUnitOwner(this.cop, newOwner, true);
		//SetUnitOwner(this.guard, newOwner, true);

		IssuePointOrder(this.barrack, 'setrally', GetUnitX(this.barrack) - 70, GetUnitY(this.barrack) - 155);
	}

	//Internal Functions
	private setBarrack(x: number, y: number, name?: string) {
		this._barrack = CreateUnit(NEUTRAL_HOSTILE, this.defaultBarrackType, x, y, 270);
		City.fromBarrack.set(this.barrack, this);

		if (name && name != GetUnitName(this.barrack)) BlzSetUnitName(this.barrack, name);
	}

	/**
	 * Previously setGuard & createGuard
	 */
	private setGuard(guard: unit | number) {
		//TODO add null checking - 4/23/2022 idk what needs null checked maybe check if guard is null and handle it
		//TODO would this have fixed the ship not taking ports bug? 6-2-2022
		typeof guard === 'number'
			? (this._guard = CreateUnit(NEUTRAL_HOSTILE, guard, this.x, this.y, 270))
			: (this._guard = guard);
		UnitAddType(this.guard, UTYPE.GUARD);
		City.fromGuard.set(this.guard, this);
	}

	/**
	 * Previously removeGuard & deleteGuard
	 */
	private removeGuard(destroy: boolean = false) {
		City.fromGuard.delete(this.guard);

		if (!destroy) {
			UnitRemoveType(this.guard, UTYPE.GUARD);
		} else {
			RemoveUnit(this.guard);
		}

		this._guard = null;
	}

	public changeGuard(newGuard: unit) {
		if (this.guard != newGuard) {
			this.removeGuard(this.isGuardDummy());
			this.setGuard(newGuard);
		}

		SetUnitPosition(this.guard, this.x, this.y);
	}

	private dummyGuard(owner: player) {
		this.changeGuard(CreateUnit(owner, UID.DUMMY_GUARD, this.x, this.y, 270));
		this.setOwner(owner);
	}

	private static onEnter() {
		TriggerAddCondition(
			enterCityTrig,
			Condition(() => {
				if (IsUnitType(GetTriggerUnit(), UTYPE.TRANSPORT)) return false;

				const city: City = City.fromRegion.get(GetTriggeringRegion());

				if (isGuardValid(city)) return false;

				city.changeGuard(GetTriggerUnit());
				city.setOwner(GetOwningPlayer(GetTriggerUnit()));

				return false;
			})
		);
	}

	private static onLeave() {
		TriggerAddCondition(
			leaveCityTrig,
			Condition(() => {
				if (!IsUnitType(GetTriggerUnit(), UTYPE.GUARD)) return false;

				const city: City = City.fromRegion.get(GetTriggeringRegion());
				let g: group = CreateGroup();
				let guardChoice: unit = city.guard;

				GroupEnumUnitsInRange(g, city.x, city.y, CityRegionSize, FilterOwnedGuards(city));

				if (BlzGroupGetSize(g) == 0)
					GroupEnumUnitsInRange(g, city.x, city.y, CityRegionSize, FilterFriendlyValidGuards(city));

				if (BlzGroupGetSize(g) == 0 && !isGuardValid(city)) {
					city.dummyGuard(GetOwningPlayer(city.barrack));
					return false;
				}

				ForGroup(g, () => {
					guardChoice = compareValue(GetEnumUnit(), guardChoice);
				});

				city.changeGuard(guardChoice);

				DestroyGroup(g);
				g = null;
				guardChoice = null;

				return false;
			})
		);
	}

	private static onTrain() {
		TriggerAddCondition(
			unitTrainedTrig,
			Condition(() => {
				const city: City = City.fromBarrack.get(GetTriggerUnit());
				let trainedUnit: unit = GetTrainedUnit();

				if (city.isPort()) {
					if (IsUnitType(trainedUnit, UTYPE.TRANSPORT)) {
						TransportManager.getInstance().add(trainedUnit);
					}

					if (city.isGuardShip() && !IsUnitType(trainedUnit, UTYPE.SHIP)) {
						city.changeGuard(trainedUnit);
					}
				}

				trainedUnit = null;
				return false;
			})
		);
	}
}
