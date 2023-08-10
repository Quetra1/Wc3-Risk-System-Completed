import { GamePlayer } from 'app/player/player-type';
import { PlayLocalSound } from 'libs/utils';
import { HexColors } from 'resources/hexColors';
import { NEUTRAL_HOSTILE } from 'resources/constants';
import { Cities, City } from './city-type';
import { Spawner } from './spawner-type';

export class Country {
	public name: string;
	private _cities: City[] = [];
	private spawner: Spawner;
	private text: texttag;
	private _owner: player;
	public citiesOwned: Map<GamePlayer, number> = new Map<GamePlayer, number>();
	public allocLim: number;

	public static fromName = new Map<string, Country>(); //Can be  gotten rid of and use fromCity instead
	public static fromCity = new Map<City, Country>();

	constructor(name: string, x: number, y: number, ...cities: City[]) {
		this.name = name;

		cities.forEach((city) => {
			this.cities.push(city);
			Country.fromCity.set(city, this);
		});

		this.spawner = new Spawner(this.name, x, y, this.cities.length);

		const offsetX: number = GetUnitX(this.spawner.unit) - 100;
		const offsetY: number = GetUnitY(this.spawner.unit) - 300;
		const lengthCheck: number = this.name.length * 5.5 < 200 ? this.name.length * 5.5 : 200;

		this.text = CreateTextTag();
		SetTextTagText(this.text, `${HexColors.TANGERINE} ${this.name}`, 0.028);
		SetTextTagPos(this.text, offsetX - lengthCheck, offsetY, 16.0);
		SetTextTagVisibility(this.text, true);
		SetTextTagPermanent(this.text, true);

		this.allocLim = Math.floor(cities.length / 2);

		this._owner = NEUTRAL_HOSTILE;
	}

	//Static API
	public static init() {
		Country.fromName.set("Mozambique", new Country("Mozambique", -16582.5, -13508.5, Cities[1], Cities[2], Cities[3]))
		Country.fromName.set("Tanzania", new Country("Tanzania", -16454.5, -10693.0, Cities[4], Cities[5], Cities[6]))
		Country.fromName.set("Somalia", new Country("Somalia", -12362.75, -6342.75, Cities[9], Cities[10], Cities[11]))
		Country.fromName.set("South Ethiopia", new Country("Ethiopia", -15818.75, -6341.25, Cities[14], Cities[15], Cities[16]))
		Country.fromName.set("North Ethiopia", new Country("North Ethiopia", -15042.75, -4289.0, Cities[17], Cities[18], Cities[19]))
		Country.fromName.set("Sudan", new Country("Sudan", -17234.0, -1857.25, Cities[20], Cities[21], Cities[22]))
		Country.fromName.set("Saudi Arabia", new Country("Saudi Arabia", -14922.25, 1211.5, Cities[23], Cities[25], Cities[26], Cities[27], Cities[28]))
		Country.fromName.set("Jordan", new Country("Jordan", -16967.0, 3641.25))
		Country.fromName.set("Iraq", new Country("Iraq", -14665.0, 5571.5, Cities[29], Cities[30], Cities[31]))
		Country.fromName.set("Syria", new Country("Syria", -16965.5, 5684.5, Cities[32], Cities[33]))
		Country.fromName.set("Turkey", new Country("Turkey", -16202.0, 8501.5, Cities[34], Cities[35], Cities[36]))
		Country.fromName.set("Georgia", new Country("Georgia", -14271.0, 9541.0, Cities[37], Cities[38]))
		Country.fromName.set("South Russia", new Country("South Russia", -13761.25, 11970.25, Cities[39], Cities[40], Cities[41], Cities[42]))
		Country.fromName.set("Ukraine", new Country("Ukraine", -13761.25, 11970.25, Cities[43], Cities[44]))
		Country.fromName.set("Taiwan", new Country("Taiwan", 10306.25, 1852.5, Cities[12], Cities[13]))
		Country.fromName.set("East Malaysia", new Country("East Malaysia", 9532.5, -8644.5, Cities[45], Cities[46], Cities[47]))
		Country.fromName.set("Lower Indonesia", new Country("Lower Indonesia", 7995.0, -15559.0, Cities[48], Cities[49]))
		Country.fromName.set("Bhutan", new Country("Bhutan", 56.5, 953.5, Cities[50]))
		Country.fromName.set("Northeast India", new Country("Northeast India", 1342.0, 1212.75, Cities[51], Cities[52]))
		Country.fromName.set("Nepal", new Country("Nepal", -1994.0, 1087.75, Cities[53], Cities[54]))
		Country.fromName.set("Tibet", new Country("Tibet", -1600.0, 3902.0, Cities[55], Cities[56], Cities[57], Cities[58], Cities[59]))
		Country.fromName.set("West Malaysia", new Country("West Malaysia", 4668.0, -9800.0, Cities[60], Cities[61]))
		Country.fromName.set("Yunnan", new Country("Yunnan", 3771.0, 55.75, Cities[62], Cities[63]))
		Country.fromName.set("South Korea", new Country("South Korea", 10555.5, 9020.25, Cities[64]))
		Country.fromName.set("North korea", new Country("North Korea", 9656.75, 11199.0, Cities[65], Cities[66]))
		Country.fromName.set("Russia Far East", new Country("Russia Far East", 9275.25, 15673.0, Cities[67], Cities[68]))
		Country.fromName.set("Japan", new Country("Japan", 13501.0, 10550.5, Cities[69], Cities[70], Cities[71], Cities[72]))
		Country.fromName.set("Sapporo", new Country("Sapporo", 13369.5, 15293.25, Cities[73], Cities[74]))
		Country.fromName.set("North Philippines", new Country("North Philippines", 11192.25, -964.0, Cities[75], Cities[76]))
		Country.fromName.set("South Philippines", new Country("South Philippines", 12984.5, -5321.75, Cities[77], Cities[78]))
		Country.fromName.set("Hulunbuir Steppes (China)", new Country("Hulunbuir Steppes", 7100.75, 14651.25, Cities[79], Cities[80], Cities[81]))
		Country.fromName.set("Inner Mongolia (China)", new Country("Inner Mongolia", 3773.5, 7993.25, Cities[82], Cities[83], Cities[84]))
		Country.fromName.set("South Xinjiang", new Country("South Xinjiang", -3015.0, 6331.0, Cities[85], Cities[86], Cities[87]))
		Country.fromName.set("North Xinjiang", new Country("North Xinjiang", -963.25, 8761.5, Cities[88], Cities[89], Cities[90], Cities[91], Cities[92]))
		Country.fromName.set("Mongolia", new Country("Mongolia", 3646.25, 12086.5, Cities[93], Cities[94], Cities[95], Cities[96], Cities[97], Cities[98]))
		Country.fromName.set("North China", new Country("North China", 8253.5, 12211.0, Cities[99], Cities[100], Cities[101], Cities[102]))
		Country.fromName.set("Central China", new Country("Central China", 1719.5, 5690.25, Cities[103], Cities[104], Cities[105], Cities[106]))
		Country.fromName.set("South India", new Country("South India", -4164.5, -4932.75, Cities[107], Cities[108], Cities[109], Cities[110], Cities[111]))
		Country.fromName.set("Sri Lanka", new Country("Sri Lanka", -2755.75, -10307.75, Cities[112], Cities[113]))
		Country.fromName.set("Central India", new Country("Central India", -3521.25, -2503.5, Cities[114], Cities[115], Cities[116], Cities[117], Cities[118]))
		Country.fromName.set("West India", new Country("West India", -5953.0, 57.75, Cities[119], Cities[120], Cities[121]))
		Country.fromName.set("Pradesh", new Country("Pradesh", -4037.75, 951.25, Cities[122], Cities[123], Cities[124]))
		Country.fromName.set("North India", new Country("North India", -4034.25, 2750.25, Cities[125], Cities[126], Cities[127]))
		Country.fromName.set("East China", new Country("East China", 6449.5, 3382.25, Cities[128], Cities[129], Cities[130], Cities[131], Cities[132], Cities[133], Cities[134], Cities[135]))
		Country.fromName.set("Pakistan", new Country("Pakistan", -6990.0, 1980.25, Cities[136], Cities[137], Cities[138], Cities[139]))
		Country.fromName.set("Iran", new Country("Iran", -11463.75, 3386.0, Cities[140], Cities[141], Cities[142], Cities[143], Cities[144], Cities[145]))
		Country.fromName.set("Azerbaijan", new Country("Azerbaijan", -12739.75, 8506.0, Cities[146], Cities[147]))
		Country.fromName.set("Afghanistan", new Country("Afghanistan", -7880.5, 4540.25, Cities[148], Cities[149], Cities[150], Cities[151]))
		Country.fromName.set("Turkmenistan", new Country("Turkmenistan", -9544.75, 7736.25, Cities[152], Cities[153]))
		Country.fromName.set("Uzbekistan", new Country("Uzbekistan", -8005.5, 9016.25, Cities[154], Cities[155]))
		Country.fromName.set("Tajikistan", new Country("Tajikistan", -5824.25, 6967.5, Cities[156], Cities[157]))
		Country.fromName.set("Kyrgyzstan", new Country("Kyrgyzstan", -4428.25, 7999.5, Cities[158], Cities[159]))
		Country.fromName.set("East Kazakhstan", new Country("East Kazakhstan", -4802.25, 11451.0, Cities[160], Cities[161], Cities[162], Cities[163], Cities[164], Cities[165]))
		Country.fromName.set("Mangystau", new Country("Mangystau", -10179.5, 10297.75, Cities[166], Cities[167]))
		Country.fromName.set("West Kazakhstan", new Country("West Kazakhstan", -10053.5, 12856.75, Cities[168], Cities[169], Cities[170]))
		Country.fromName.set("Hainan", new Country("Hainan", 6717.5, -1609.75, Cities[171]))
		Country.fromName.set("Volga", new Country("Volga", -12995.75, 15413.25, Cities[172], Cities[173]))
		Country.fromName.set("Ural", new Country("Ural", -10181.0, 15799.25, Cities[174], Cities[175], Cities[176]))
		Country.fromName.set("Central Russia", new Country("Central Russia", -6597.75, 15288.5, Cities[177], Cities[178], Cities[179]))
		Country.fromName.set("Siberia", new Country("Siberia", -458.25, 14905.5, Cities[180], Cities[181], Cities[182]))
		Country.fromName.set("Eastern Russia", new Country("Eastern Russia", 4155.5, 15165.0, Cities[183], Cities[184], Cities[185]))
		Country.fromName.set("Cambodia", new Country("Cambodia", 6454.5, -5703.75, Cities[186], Cities[187], Cities[188]))
		Country.fromName.set("Thailand", new Country("Thailand", 4924.0, -4677.5, Cities[189], Cities[190], Cities[191]))
		Country.fromName.set("Myanmar", new Country("Myanmar", 2489.25, -1988.25, Cities[192], Cities[193], Cities[194]))
		Country.fromName.set("Bangladesh", new Country("Bangladesh", 56.5, -840.5, Cities[195], Cities[196]))
		Country.fromName.set("Vietnam", new Country("Vietnam", 5691.5, -824.0, Cities[197], Cities[198]))
		Country.fromName.set("Laos", new Country("Laos", 4537.5, -1595.75, Cities[199], Cities[200]))
		Country.fromName.set("Yemen", new Country("Yemen", -12865.5, -2756.0, Cities[201], Cities[202]))
		Country.fromName.set("Oman", new Country("Oman", -10817.5, -845.0, Cities[203], Cities[204]))
		Country.fromName.set("UAE", new Country("UAE", -11850.25, 185.75, Cities[205], Cities[206]))
		Country.fromName.set("Madagascar", new Country("Madagascar", -12740.75, -13636.25, Cities[207], Cities[208], Cities[209], Cities[210]))
		Country.fromName.set("West Indonesia", new Country("West Indonesia", 4537.5, -12364.0, Cities[211], Cities[212], Cities[213], Cities[214]))
		Country.fromName.set("East Timor", new Country("East Timor", 13242.25, -14663.5, Cities[215], Cities[216]))
		Country.fromName.set("East Indonesia", new Country("East Indonesia", 9530.0, -10949.75, Cities[217], Cities[218], Cities[219], Cities[220], Cities[221]))

	}

	//Public API
	public get cities(): City[] {
		return this._cities;
	}

	public get size() {
		return this.cities.length;
	}

	public get owner(): player {
		return this._owner;
	}

	public animate() {
		if (this.owner == NEUTRAL_HOSTILE) return;

		this.cities.forEach((city) => {
			const effect = AddSpecialEffect(
				'Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl',
				GetUnitX(city.barrack),
				GetUnitY(city.barrack)
			);
			BlzSetSpecialEffectScale(effect, 1.1);
			DestroyEffect(effect);
		});
	}

	public initCitiesOwned() {
		GamePlayer.fromPlayer.forEach((gPlayer) => {
			if (GetPlayerId(gPlayer.player) >= 25) return;

			this.citiesOwned.set(gPlayer, 0);
		});
	}

	public isOwned(): boolean {
		return this.owner == NEUTRAL_HOSTILE ? false : true;
	}

	public step() {
		this.spawner.step();
	}

	public setOwner(who: player) {
		if (who == this.owner) return;

		GamePlayer.fromPlayer.get(this.owner).income -= this.cities.length;

		GamePlayer.fromPlayer.get(who).income += this.cities.length;
		this._owner = who;
		this.spawner.setOwner(who);

		this.animate();

		DisplayTimedTextToPlayer(who, 0.82, 0.81, 3.0, `${HexColors.TANGERINE}${this.name}|r has been conquered!`);

		PlayLocalSound('Sound\\Interface\\Rescue.flac', who);

	}

	public reset() {
		this._owner = NEUTRAL_HOSTILE;
		this.spawner.reset();
		this.initCitiesOwned();
	}
	//Internal Functions
}
