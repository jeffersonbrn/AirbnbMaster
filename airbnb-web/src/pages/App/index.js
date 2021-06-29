import React, { Component } from "react";
import Dimensions from "react-dimensions";
import { Container } from "./styles";
import MapGL from "react-map-gl";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import api from "../../services/api";
import Properties from "./components/Properties";

const TOKEN =
  "pk.eyJ1IjoiamVmZmVyc29uYnJuIiwiYSI6ImNrcWhidHJ3YzFvYTIydm1pdXo4eDMyMGQifQ.M_pvEWdX4qqdIPfx7kzHtA";

class Map extends Component {
  static propTypes = {
    containerWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired
  };

  constructor() {
    super();
    this.updatePropertiesLocalization = debounce(
      this.updatePropertiesLocalization,
      500
    );
  }

  state = {
    viewport: {
      latitude: -27.2108001,
      longitude: -49.6446024,
      zoom: 12.8,
      bearing: 0,
      pitch: 0
    },
    properties:[

    ]
  };

  componentDidMount() {
    this.loadProperties();
  }

  updatePropertiesLocalization(){
    this.loadProperties();
  }

  loadProperties = async () => {
    const { latitude, longitude } = this.state.viewport;
    try {
      const response = await api.get("/properties", {
        params: {latitude, longitude}
      });
      this.setState({properties: response.data});
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { containerWidth: width, containerHeight: height } = this.props;
    return (
      <MapGL
        width={width}
        height={height}
        {...this.state.viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken={TOKEN}
        onViewportChange={viewport => this.setState({ viewport })}
      />
    );
  }
}

const DimensionedMap = Dimensions()(Map);
const App = () => (
  <Container>
    <DimensionedMap />
  </Container>
);



export default App;