import { HexColors } from "resources/hexColors";
import { NEUTRAL_HOSTILE } from "resources/constants";
import CameraControls, { PlayerCamData } from "../commands/camera-controls-type";
import { GamePlayer, PlayerStatus } from "../player/player-type";
import { easySlider } from "./easySlider";
import { GameType } from "app/modes/gameType";
import { Frame, Trigger } from "w3ts";
import { Settings } from "app/game/round-settings";
import { AllyLimit } from "app/modes/allyLimit";
import { Diplomancy } from "app/modes/diplomancy";
import { Fog } from "app/modes/fog";
import { RevealNames } from "app/modes/revealNames";
import { GoldSending } from "app/modes/goldSending";
import { NomadTimeLimit } from "app/modes/nomadTimeLimit";
import { ShipsAllowed } from "app/modes/shipsAllowed";
import { TransportLanding } from "app/modes/transports";
import { Slider } from "./slider";

export class ModeUI {
	public static frame: Map<string, framehandle> = new Map<string, framehandle>();
	public static frameFunc: Map<string, Function> = new Map<string, Function>();
	public static fullControlBox: Frame;

	public static buildModeFrame() {
		//Backdrop
		const backdrop: framehandle = BlzCreateFrame("EscMenuBackdrop", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		BlzFrameSetAbsPoint(backdrop, FRAMEPOINT_CENTER, 0.4, 0.3);
		BlzFrameSetSize(backdrop, 0.80, 0.46);

		//Title
		const title: framehandle = BlzCreateFrameByType("BACKDROP", "title", backdrop, "", 0);
		BlzFrameSetSize(title, 0.20, 0.15);
		BlzFrameSetPoint(title, FRAMEPOINT_CENTER, backdrop, FRAMEPOINT_TOP, 0.00, -0.045);
		BlzFrameSetTexture(title, "war3mapimported\\ModeTitle.dds", 0, true);

		//Player List
		ModeUI.pList(backdrop);

		//Command List
		const cList: framehandle = BlzCreateFrameByType("TEXTAREA", "cList", backdrop, "BattleNetTextAreaTemplate", 0);
		BlzFrameSetSize(cList, 0.30, 0.26);
		BlzFrameSetPoint(cList, FRAMEPOINT_TOP, backdrop, FRAMEPOINT_TOP, 0.00, -0.1);
		//Commands
		BlzFrameAddText(cList, `${HexColors.RED}Typed Commands:|r`)
		BlzFrameAddText(cList, `${HexColors.TANGERINE}-cam ####|r  Changes the camera view distance`)
		BlzFrameAddText(cList, `${HexColors.TANGERINE}-def|r  Changes the camera to the default settings`)
		BlzFrameAddText(cList, `${HexColors.TANGERINE}-forfeit / -ff|r  Forfeit the game without exiting`)
		BlzFrameAddText(cList, `${HexColors.TANGERINE}-restart / -ng|r  Restart the current game if it's over`)
		BlzFrameAddText(cList, `${HexColors.TANGERINE}-names / -players|r  Lists active players`)
		//BlzFrameAddText(cList, `${HexColors.TANGERINE}-sb 1 / -sb 2|r  Changes the scoreboard layout`)
		BlzFrameAddText(cList, `${HexColors.TANGERINE}-stfu name|r  Globally mute a player for 5 minutes`)
		//Hotkeys
		BlzFrameAddText(cList, `|n${HexColors.RED}Hotkeys:|r`)
		BlzFrameAddText(cList, `${HexColors.TANGERINE}F1|r  Opens player tools`)
		//BlzFrameAddText(cList, `${HexColors.TANGERINE}F2|r  Changes scoreboard layout`)
		BlzFrameAddText(cList, `${HexColors.TANGERINE}F8|r  Cycles owned spawners`)

		//Timer
		const timer: framehandle = BlzCreateFrameByType("Text", "cTimer", backdrop, "EscMenuLabelTextTemplate", 0);
		BlzFrameSetPoint(timer, FRAMEPOINT_RIGHT, backdrop, FRAMEPOINT_BOTTOMRIGHT, -0.03, 0.04);
		BlzFrameSetText(timer, "Mode selection ends in 15 Seconds");

		//Discord box
		const dBox: framehandle = BlzCreateFrame("EscMenuEditBoxTemplate", backdrop, 0, 1);
		BlzFrameSetPoint(dBox, FRAMEPOINT_BOTTOMLEFT, cList, FRAMEPOINT_TOPLEFT, 0.00, 0.003);
		BlzFrameSetSize(dBox, 0.11, 0.03);
		BlzFrameSetText(dBox, "discord.me/risk");
		//dBox reset
		const dtrig: trigger = CreateTrigger();
		BlzTriggerRegisterFrameEvent(dtrig, dBox, FRAMEEVENT_EDITBOX_TEXT_CHANGED);
		TriggerAddAction(dtrig, () => {
			const p: player = GetTriggerPlayer();

			if (GetLocalPlayer() == p) {
				BlzFrameSetText(dBox, "discord.me/risk");
			}
		});

		//Camera box
		const cBox: framehandle = BlzCreateFrame("EscMenuEditBoxTemplate", backdrop, 0, 0);
		BlzFrameSetPoint(cBox, FRAMEPOINT_BOTTOMRIGHT, cList, FRAMEPOINT_TOPRIGHT, 0.00, 0.003);
		BlzFrameSetSize(cBox, 0.05, 0.03);
		BlzFrameSetText(cBox, "");

		//cBox update
		const ctrig: trigger = CreateTrigger();
		BlzTriggerRegisterFrameEvent(ctrig, cBox, FRAMEEVENT_EDITBOX_TEXT_CHANGED);
		TriggerAddAction(ctrig, () => {
			const distance: string = BlzGetTriggerFrameText();
			const p: player = GetTriggerPlayer();

			if (GetLocalPlayer() == p) {
				BlzFrameSetTextSizeLimit(cBox, 4);
				CameraControls.getInstance().checkCamData(PlayerCamData.get(p), [distance])
			}
		});

		//cBox text
		const cBoxText: framehandle = BlzCreateFrameByType("TEXT", "cBoxText", cBox, "EscMenuLabelTextTemplate", 0);

		BlzFrameSetPoint(cBoxText, FRAMEPOINT_RIGHT, cBox, FRAMEPOINT_LEFT, 0, -0.001);
		BlzFrameSetText(cBoxText, `Enter Cam Distance`);

		//Observe button
		const obsStr: string = "OBSERVE GAME"
		ModeUI.createButton(obsStr, FRAMEPOINT_TOP, cList, FRAMEPOINT_BOTTOM, 0, -0.01, 0.2, 0.06);
		ModeUI.frameFunc.set(obsStr, () => {
			const player: GamePlayer = GamePlayer.fromPlayer.get(GetTriggerPlayer());

			try {
				if (player.isPlaying()) {
					player.setStatus(PlayerStatus.OBSERVING);
					//SetPlayerState(player.player, PLAYER_STATE_OBSERVER, 1)
					if (GetLocalPlayer() == player.player) {
						BlzFrameSetText(ModeUI.frame.get(obsStr), "PLAY GAME");
					}
				} else {
					player.setStatus(PlayerStatus.PLAYING);
					//SetPlayerState(player.player, PLAYER_STATE_OBSERVER, 0)
					if (GetLocalPlayer() == player.player) {
						BlzFrameSetText(ModeUI.frame.get(obsStr), obsStr);
					}
				}
			} catch (error) {
				print(error)
			}
		})

		BlzFrameSetVisible(BlzGetFrameByName(obsStr, 0), true);

		new Slider("Game Type", backdrop, 0.058, -0.06, 0.002, GameType, () => {
			Settings.getInstance().gameType = BlzFrameGetValue(Slider.fromName("Game Type").slider);

			if (BlzFrameGetValue(Slider.fromName("Game Type").slider) > 0) {
				BlzFrameSetTextColor(Slider.fromName("Game Type").text, BlzConvertColor(255, 255, 0 ,0))
			} else {
				BlzFrameSetTextColor(Slider.fromName("Game Type").text, BlzConvertColor(255, 255, 255 ,255))
			}
		});

		new Slider("Diplomancy", backdrop, 0.061, -0.10, -0.001, Diplomancy, () => {
			let val: number = BlzFrameGetValue(Slider.fromName("Diplomancy").slider)

			Settings.getInstance().diplomancy = val;

			const aLimit: Slider = Slider.fromName("Ally Limit");
			//const box: Slider = Slider.fromName("Transports Load/Unload");

			if (val > 0) {
				// this.fullControlBox.setEnabled(true);
			} else {
				// this.fullControlBox.setEnabled(false);
			}

			if (val > 1) {
				BlzFrameSetEnable(aLimit.slider, true);
			} else {
				BlzFrameSetEnable(aLimit.slider, false);
			}

			if (BlzFrameGetValue(Slider.fromName("Diplomancy").slider) > 0) {
				BlzFrameSetTextColor(Slider.fromName("Diplomancy").text, BlzConvertColor(255, 255, 0 ,0))
			} else {
				BlzFrameSetTextColor(Slider.fromName("Diplomancy").text, BlzConvertColor(255, 255, 255 ,255))
			}
		});

		new Slider("Ally Limit", backdrop, 0.053, -0.14, 0.007, AllyLimit, () => {
			Settings.getInstance().allies = (BlzFrameGetValue(Slider.fromName("Ally Limit").slider) + 1);
		});
			BlzFrameSetEnable(Slider.fromName("Ally Limit").slider, false);

		// this.fullControlBox = new Frame("Full Unit Control", Frame.fromName("Ally Limit", 0), 0, 0, "CHECKBOX", "QuestCheckBox2");
		// const fullControlTitle = new Frame("Full Unit Control Title", this.fullControlBox, 0, 0, "TEXT", "EscMenuLabelTextTemplate");
		// const fullControlTrigger: Trigger = new Trigger();

		// this.fullControlBox.setPoint(FRAMEPOINT_CENTER, Frame.fromName("Ally Limit", 0), FRAMEPOINT_BOTTOMLEFT, 0.01, -0.01)
		// fullControlTitle.setPoint(FRAMEPOINT_LEFT, this.fullControlBox, FRAMEPOINT_RIGHT, 0, 0);
		// fullControlTitle.setText(`Full Unit Control`);

		// fullControlTrigger.triggerRegisterFrameEvent(this.fullControlBox, FRAMEEVENT_CHECKBOX_CHECKED);
		// fullControlTrigger.triggerRegisterFrameEvent(this.fullControlBox, FRAMEEVENT_CHECKBOX_UNCHECKED);

		// fullControlTrigger.addAction(() => {
		// 	if (Frame.getEventHandle() == FRAMEEVENT_CHECKBOX_CHECKED) {
		// 		Settings.getInstance().alliesControl = 1;
		// 	} else {
		// 		Settings.getInstance().alliesControl = 0;
		// 	}
		// })

		// this.fullControlBox.setEnabled(false);

		new Slider("Fog", backdrop, 0.039, -0.19, 0.021, Fog, () => {
			Settings.getInstance().fog = BlzFrameGetValue(Slider.fromName("Fog").slider);

			if (BlzFrameGetValue(Slider.fromName("Fog").slider) > 0) {
				BlzFrameSetTextColor(Slider.fromName("Fog").text, BlzConvertColor(255, 255, 0 ,0))
			} else {
				BlzFrameSetTextColor(Slider.fromName("Fog").text, BlzConvertColor(255, 255, 255 ,255))
			}
		});

		new Slider("Reveal Names", backdrop, 0.064, -0.23, -0.004, RevealNames, () => {
			Settings.getInstance().names = BlzFrameGetValue(Slider.fromName("Reveal Names").slider);

			if (BlzFrameGetValue(Slider.fromName("Reveal Names").slider) > 0) {
				BlzFrameSetTextColor(Slider.fromName("Reveal Names").text, BlzConvertColor(255, 255, 0 ,0))
			} else {
				BlzFrameSetTextColor(Slider.fromName("Reveal Names").text, BlzConvertColor(255, 255, 255 ,255))
			}
		});

		new Slider("Nomad Time Limit", backdrop, 0.075, -0.27, -0.015, NomadTimeLimit, () => {
			Settings.getInstance().nomad = BlzFrameGetValue(Slider.fromName("Nomad Time Limit").slider);

			if (BlzFrameGetValue(Slider.fromName("Nomad Time Limit").slider) > 0) {
				BlzFrameSetTextColor(Slider.fromName("Nomad Time Limit").text, BlzConvertColor(255, 255, 0 ,0))
			} else {
				BlzFrameSetTextColor(Slider.fromName("Nomad Time Limit").text, BlzConvertColor(255, 255, 255 ,255))
			}
		});

		new Slider("Gold Sending", backdrop, 0.064, -0.31, -0.004, GoldSending, () => {
			Settings.getInstance().gold = BlzFrameGetValue(Slider.fromName("Gold Sending").slider);

			if (BlzFrameGetValue(Slider.fromName("Gold Sending").slider) > 0) {
				BlzFrameSetTextColor(Slider.fromName("Gold Sending").text, BlzConvertColor(255, 255, 0 ,0))
			} else {
				BlzFrameSetTextColor(Slider.fromName("Gold Sending").text, BlzConvertColor(255, 255, 255 ,255))
			}
		});

		new Slider("Ships Allowed", backdrop, 0.066, -0.35, -0.006, ShipsAllowed, () => {
			Settings.getInstance().ships = BlzFrameGetValue(Slider.fromName("Ships Allowed").slider);

			const transports: Slider = Slider.fromName("Transports Load/Unload");

			if (Settings.getInstance().ships == 1) {
				BlzFrameSetValue(transports.slider, 1);
				BlzFrameSetEnable(transports.slider, false);
			} else {
				BlzFrameSetValue(transports.slider, 0);
				BlzFrameSetEnable(transports.slider, true);
			}

			if (BlzFrameGetValue(Slider.fromName("Ships Allowed").slider) > 0) {
				BlzFrameSetTextColor(Slider.fromName("Ships Allowed").text, BlzConvertColor(255, 255, 0 ,0))
			} else {
				BlzFrameSetTextColor(Slider.fromName("Ships Allowed").text, BlzConvertColor(255, 255, 255 ,255))
			}
		});

		new Slider("Transports Load/Unload", backdrop, 0.089, -0.39, -0.029, TransportLanding, () => {
			Settings.getInstance().transport = BlzFrameGetValue(Slider.fromName("Transports Load/Unload").slider);

			if (BlzFrameGetValue(Slider.fromName("Transports Load/Unload").slider) > 0) {
				BlzFrameSetTextColor(Slider.fromName("Transports Load/Unload").text, BlzConvertColor(255, 255, 0 ,0))
			} else {
				BlzFrameSetTextColor(Slider.fromName("Transports Load/Unload").text, BlzConvertColor(255, 255, 255 ,255))
			}
		});
		// //Modes Info
		// const modesInfo: framehandle = BlzCreateFrameByType("TEXT", "modesInfo", backdrop, "EscMenuLabelTextTemplate", 0);
		// BlzFrameSetPoint(modesInfo, FRAMEPOINT_TOP, backdrop, FRAMEPOINT_TOP, -0.27, -0.11);
		// const modesText: string = `${HexColors.RED}Game Settings|r\nGame Tracking: ${HexColors.GREEN}Unranked|r\nDiplomancy: ${HexColors.GREEN}FFA|r\nFog: ${HexColors.GREEN}Off|r\nReveal Names: ${HexColors.GREEN}On Victory|r\nNomad Time: ${HexColors.GREEN}60 Seconds|r\nGold Sending: ${HexColors.GREEN}Disabled|r\nShips Allowed: ${HexColors.GREEN}All|r\nTransport Load/Unload: ${HexColors.GREEN}Ports Only|r`
		// BlzFrameSetText(modesInfo, modesText);
	}

	private static createButton(name: string, framePoint: framepointtype, parent: framehandle, parentPoint: framepointtype, x: number, y: number, width: number, height: number) {
		let bFrame: framehandle = BlzCreateFrameByType("GLUETEXTBUTTON", name, parent, "ScriptDialogButton", 0);
		BlzFrameSetPoint(bFrame, framePoint, parent, parentPoint, x, y);
		BlzFrameSetText(bFrame, name);
		BlzFrameSetSize(bFrame, width, height);

		ModeUI.frame.set(name, bFrame);

		let frameTrig: trigger = CreateTrigger();
		BlzTriggerRegisterFrameEvent(frameTrig, bFrame, FRAMEEVENT_CONTROL_CLICK);
		TriggerAddAction(frameTrig, () => {
			ModeUI.frameFunc.get(name)();
			BlzFrameSetEnable(bFrame, false);
			BlzFrameSetEnable(bFrame, true);
		})

		BlzFrameSetVisible(bFrame, false);

		frameTrig = null;
		bFrame = null;
	}

	public static pList(backdrop: framehandle) {
		const pList: framehandle = BlzCreateFrameByType("TEXTAREA", "pList", backdrop, "BattleNetTextAreaTemplate", 0);
		BlzFrameSetSize(pList, 0.20, 0.38);
		BlzFrameSetPoint(pList, FRAMEPOINT_TOPRIGHT, backdrop, FRAMEPOINT_TOPRIGHT, -0.025, -0.025);

		GamePlayer.fromPlayer.forEach(gPlayer => {
			if (gPlayer.player == NEUTRAL_HOSTILE)
				return;

			BlzFrameAddText(pList, `${gPlayer.names.acct} is ${gPlayer.status}`);
		});
	}

	public static toggleForPlayer(fName: string, p: player, bool: boolean) {
		if (GetLocalPlayer() == p) {
			BlzFrameSetVisible(ModeUI.frame.get(fName), bool);
		}
	}

	public static toggleModeFrame(bool: boolean) {
		BlzFrameSetVisible(BlzGetFrameByName("Game Type slider", 0), true);
		BlzFrameSetVisible(BlzGetFrameByName("Diplomancy slider", 0), true);
		BlzFrameSetVisible(BlzGetFrameByName("Ally Limit slider", 0), true);
		BlzFrameSetVisible(BlzGetFrameByName("Fog slider", 0), true);
		BlzFrameSetVisible(BlzGetFrameByName("Reveal Names slider", 0), true);
		BlzFrameSetVisible(BlzGetFrameByName("Nomad Time Limit slider", 0), true);
		BlzFrameSetVisible(BlzGetFrameByName("Gold Sending slider", 0), true);
		BlzFrameSetVisible(BlzGetFrameByName("Ships Allowed slider", 0), true);
		BlzFrameSetVisible(BlzGetFrameByName("Transports Load/Unload slider", 0), true);

		BlzFrameSetVisible(BlzGetFrameByName("EscMenuBackdrop", 0), bool);
	}
}