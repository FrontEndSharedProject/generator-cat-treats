if (module.hot) {
  module.hot.accept();
}

import "./scss/index.scss";
import Photo from "./js/photo";

new Photo('.photo');
