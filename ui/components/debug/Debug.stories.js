import React from "react";
import { StaticRouter } from "react-router-dom";

import { Debug } from "./Debug";

import { PrestissimoApi } from '../../helpers/PrestissimoApi';

export default {
  title: Debug.name,
};

export const withDefault = () => {
  return (
    <StaticRouter location="/debug">
      <Debug />
    </StaticRouter>
  );
};
