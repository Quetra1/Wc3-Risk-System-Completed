export class FogStateManager {
	private static instance: FogStateManager;
	private fog: Map<player, fogmodifier>;

	private constructor() {
		this.fog = new Map<player, fogmodifier>();
		FogEnable(true);
		FogMaskEnable(false);
	}

	public static getInstance(): FogStateManager {
		if (this.instance == null) {
			this.instance = new FogStateManager();
		}

		return this.instance;
	}

	/**
	 * Adds a player to have their fogstate tracked and controlled
	 * @param who the player to be managed
	 */
	public add(who: player) {
		this.fog.set(who, CreateFogModifierRect(who, FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, true));
	}

	/**
	 * Remove a player from the manager.
	 * @param who the player to be removed
	 */
	public remove(who: player) {
		DestroyFogModifier(this.fog.get(who));
		this.fog.delete(who);
	}

	/**
	 * Turns on fog for player(s).
	 * If no player is provided then it will turn on for all players
	 * If a player is provided then it will turn it on for that player only
	 * @param who optional arugment that can be passed to only target fog state for specific player.
	 */
	public on(who?: player) {
		if (who && !IsPlayerObserver(who)) return FogModifierStop(this.fog.get(who));

		this.fog.forEach((fog, player) => {
			if (IsPlayerObserver(player)) {
				return;
			}

			FogModifierStop(fog);
		});
	}

	/**
	 * Turns off fog for player(s).
	 * If no player is provided then it will turn off for all players
	 * If a player is provided then it will turn it off for that player only
	 * @param who optional arugment that can be passed to only target fog state for specific player.
	 */
	public off(who?: player) {
		if (who && !IsPlayerObserver(who)) return FogModifierStart(this.fog.get(who));

		this.fog.forEach((fog, player) => {
			if (IsPlayerObserver(player)) {
				return;
			}

			FogModifierStart(fog);
		});
	}
}
