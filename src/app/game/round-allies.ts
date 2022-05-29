import { GamePlayer } from "app/player/player-type";
import { MAX_PLAYERS } from "resources/constants";
//TODO: refactor this to use a <gameplayer, gameplayer[]> map
//I can then just track allies of a player
//Free ally mode can not support team scoreboard
export class Alliances {
	private static instance: Alliances;
	private teams: Map<player, player[]>;
	//private teamNumber: Map<number, player[]>;
	private teamNumber: Map<player, number>;
	//TODO: if all humans are on one team, disband team.
	constructor() {
		this.teamNumber = new Map<player, number>();
		this.teams = new Map<player, player[]>();
		this.setTeams();
		this.setTeamNumbers();
	}

	private setTeams() {
		for (let i = 0; i < MAX_PLAYERS; i++) {
			let p1: player = Player(i);
			if (!GamePlayer.fromPlayer.has(p1)) continue;

			if (!this.teams.has(p1)) this.teams.set(p1, []);

			for (let j = 0; j < MAX_PLAYERS; j++) {
				let p2: player = Player(j);
				if (!GamePlayer.fromPlayer.has(p2)) continue;
				if (p1 == p2) continue;

				if (this.isAllied(p1, p2)) this.teams.get(p1).push(p2);

				p2 = null;
			}

			p1 = null;
		}

		this.teams.forEach((val: [], key: player) => {
			print(`${GetPlayerName(key)} is allied to ${val.length} players`)
		})
	}

	private setTeamNumbers() {
		GamePlayer.fromPlayer.forEach(gPlayer => {
			//if (gPlayer.isNeutral()) return;
			//if (gPlayer.isObserving()) return;

			this.teamNumber.set(gPlayer.player, GetPlayerTeam(gPlayer.player));
		})

		this.teamNumber.forEach((val: number, key: player) => {
			print(`${GamePlayer.get(key).coloredName()} team #: ${val}`);
		})
	}

	public setAlliance(p1: player, p2: player, bool: boolean) {
		//TODO: check ally limit
		SetPlayerAlliance(p1, p2, ALLIANCE_PASSIVE, bool)
		SetPlayerAlliance(p1, p2, ALLIANCE_HELP_REQUEST, bool)
		SetPlayerAlliance(p1, p2, ALLIANCE_HELP_RESPONSE, bool)
		SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_XP, bool)
		SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_SPELLS, bool)
		SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_VISION, bool)
		SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_CONTROL, bool)
		//TODO: adv control option check
		SetPlayerAlliance(p1, p2, ALLIANCE_SHARED_ADVANCED_CONTROL, bool)

		if (bool) this.add(p1, p2);
		if (!bool) this.remove(p1, p2);
	}

	private add(p1: player, p2: player) {
		this.teams.get(p1).push(p2);
	}

	private remove(p1: player, p2: player) {
		if (!this.teams.has(p1)) return;
		if (this.teams.get(p1).indexOf(p2) == -1) return;

		this.teams.get(p1).splice(this.teams.get(p1).indexOf(p2), 1)
	}

	public resetMap() {
		this.teams.clear();
		this.setTeams();
	}

	public isAllied(p1: player, p2: player): boolean {
		return GetPlayerAlliance(p1, p2, ALLIANCE_PASSIVE);
	}

	public unAllyLobby() {
		for (let i = 0; i < MAX_PLAYERS; i++) {
			for (let j = 0; j < MAX_PLAYERS; j++) {
				Alliances.getInstance().setAlliance(Player(i), Player(j), false);
			}
		}
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new Alliances();
		}
		return this.instance;
	}
}