import { registerPlugin } from "@vencord/core";
import { findByPropsLazy } from "@vencord/utils";

const stereoPlugin = {
    name: "StereoPlugin",
    description: "First stereo plugin for Vencord",
    authors: [{
        id: "1111394402854764665",
        name: "Yurei"
    }],
    onStart: () => {
        BdApi.UI.showNotice(
            "[StereoPlugin] You can now go stereo",
            { type: "info", timeout: 10000 }
        );
        const voiceModule = findByPropsLazy("updateVideoQuality");
        findByPropsLazy("setTransportOptions").after(voiceModule.prototype, "updateVideoQuality", (thisObj, _args, ret) => {
            if (thisObj) {
                const setTransportOptions = thisObj.conn.setTransportOptions;
                const channelOption = "2.0"; 
                thisObj.conn.setTransportOptions = function (obj) {
                    if (obj.audioEncoder) {
                        obj.audioEncoder.params = {
                            stereo: channelOption,
                        };
                        obj.audioEncoder.channels = parseFloat(channelOption);
                    }
                    if (obj.fec) {
                        obj.fec = false;
                    }
                    if (obj.encodingVoiceBitRate < 512000) {
                        obj.encodingVoiceBitRate = 512000;
                    }

                    setTransportOptions.call(thisObj, obj);
                };
                return ret;
            }
        });
    },
    onStop: () => {
        findByPropsLazy("updateVideoQuality").unpatchAll();
    },
    getSettingsPanel: () => {
        const panel = findByPropsLazy("buildSettingsPanel")(stereoPlugin);
        return panel.getElement();
    }
};

registerPlugin(stereoPlugin);
