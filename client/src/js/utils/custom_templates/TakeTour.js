/* eslint react/jsx-wrap-multilines:0 */
import Locale from "../Locale";

export default class TakeTour {
    static show() {
        let takeTourMaskElement = document.getElementById("take-tour-mask");
        const messages = Locale.applicationStrings().messages.applicationTour;
        if(takeTourMaskElement === null) {
            takeTourMaskElement = document.createElement("div");
            takeTourMaskElement.id = "take-tour-mask";
            takeTourMaskElement.className = "take-tour-mask mask";
            takeTourMaskElement.innerHTML = `<div class='take-tour bottom-box-shadow anim' id='take-tour'>
                                            <div class='tour-popup'>
                                                <p class='description'>
                                                    <i class="help-icon"></i>
                                                    ${messages.description}
                                                </p>
                                                <div class='t-right'>
                                                    <button id='tour-abort' class="btn-secondary border">${messages.gotItText}</button>
                                                </div>
                                            </div>
                                        </div>`;
            document.body.appendChild(takeTourMaskElement);

            document.getElementById("tour-abort").addEventListener("click", ()=> {
                TakeTour.close();
            });
        }
        document.body.style.overflow = "hidden";
        document.getElementById("tour-abort").textContent = "Got it";
    }

    static close() {
        document.getElementById("take-tour-mask").classList.add("hide");
        document.body.style.overflow = "auto";
    }
}
