import math

class GeoUtils(object):
  # Reference: http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
  def get_bounding_box(self, origin, radius):
    # radius of earth in km
    EARTH_RADIUS = 6371.0
    ang_radius = float(radius)/EARTH_RADIUS

    # calculate using radians
    origin_lat, origin_lon = origin
    origin_lat = math.radians(origin_lat)
    origin_lon = math.radians(origin_lon)
    print "origin_lat", origin_lat
    print "origin_lon", origin_lon

    print "ang_radius", ang_radius

    min_lat = origin_lat - ang_radius
    max_lat = origin_lat + ang_radius

    print "min_lat", min_lat
    print "max_lat", max_lat

    lat_T = math.asin(math.sin(origin_lat)/math.cos(ang_radius))
    delta_lon = math.asin(math.sin(ang_radius)/math.cos(origin_lat))

    min_lon = origin_lon - delta_lon
    max_lon = origin_lon + delta_lon

    print "min_lon", min_lon
    print "max_lon", max_lon

    # convert back to degrees for common use
    return ((math.degrees(min_lat), math.degrees(min_lon)), 
      (math.degrees(max_lat), math.degrees(max_lon))) 
