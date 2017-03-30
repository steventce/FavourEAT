import math

class GeoUtils(object):
  # Reference: http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
  def get_bounding_box(self, origin, radius):
    # radius of earth in km
    EARTH_RADIUS = 6371.0
    ang_radius = (float(radius)/1000)/EARTH_RADIUS

    # calculate using radians
    origin_lat, origin_lon = origin
    origin_lat = math.radians(float(origin_lat))
    origin_lon = math.radians(float(origin_lon))

    min_lat = origin_lat - ang_radius
    max_lat = origin_lat + ang_radius

    lat_T = math.asin(math.sin(origin_lat)/math.cos(ang_radius))
    delta_lon = math.asin(math.sin(ang_radius)/math.cos(origin_lat))

    min_lon = origin_lon - delta_lon
    max_lon = origin_lon + delta_lon

    # convert back to degrees for common use
    return ((math.degrees(min_lat), math.degrees(min_lon)), 
      (math.degrees(max_lat), math.degrees(max_lon))) 
