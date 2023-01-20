import React, { useMemo } from "react";
import config from "../../config";
import { Address } from "../../models";

export const StreetViewImage = ({
  address,
  size = "auto",
}: {
  address: Address;
  size?: string;
}) => {
  const imageUrl = useMemo(() => {
    // TODO We should be able to look up an address without lat/long here
    // TODO (Plus lat long doesn't give enough info to actually look at the right building)
    if (address && address.latitude && address.longitude) {
      let url = "https://maps.googleapis.com/maps/api/streetview?size=640x640";
      url += `&location=${address.latitude},${address.longitude}`;
      url += "&fov=90&heading=235&pitch=10";
      if (config.GOOGLE_API_KEY) {
        url += `&key=${config.GOOGLE_API_KEY}`;
      }
      return url;
    }
    // TODO Allow configurable defaults or icons from org type
    return "http://lorempixel.com/200/200/city/";
  }, [address]);

  return (
    <img
      className="streetview"
      alt="resource"
      style={{ width: size, height: size }}
      src={imageUrl}
    />
  );
};
