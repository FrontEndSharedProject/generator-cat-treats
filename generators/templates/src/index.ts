if (module.hot) {
  module.hot.accept();

  if (module.hot) {
    module.hot.accept(); // already had this init code

    module.hot.addStatusHandler(status => {
      if (status === "prepare") console.clear();
    });
  }
}

import "./scss/index.scss";
import Photo from "./js/photo";

new Photo(".photo");
