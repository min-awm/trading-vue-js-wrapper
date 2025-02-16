# TradingVueWrapper

**TradingVueWrapper** is a wrapper for [TradingVue](https://github.com/tvjsx/trading-vue-js).

## How to use
```
const chartEl = document.getElementById("chart")
const { dc, config, app, $refs } = new TradeChart(chartEl);

const data = [
  //[timestamp, open, high, low, close, volume]
  [1597010400000, 11639, 11681, 11637.94450704, 11678, 64.09675301]
]

// set init data
dc.set("chart.data", data); 

// add ema 20
dc.add("onchart", {
    name: "EMA, 20",
    type: "EMA",
    data: [],
    settings: {
        color: "#f7890c",
        length: 20,
    },
}); 

// update data realtime
dc.update({
  candle: [timestamp, open, high, low, close, volume],
}); 
```

## Example

### [Example](https://github.com/min-awm/trading-vue-js-wrapper/blob/main/example/index.html)
*To run the examples, download the repo & run with live server*

## Config

| Name | Type | Description |
|---|---|---|
| titleTxt | String | Chart title text  |
| id | String | HTML id of root div |
| width | Number | Chart width (px) |
| height | Number | Chart height (px) |
| colorTitle | String | Title text color |
| colorBack | String | Background color |
| colorGrid | String | Grid color |
| colorText | String | Text (labels) color |
| colorTextHL | String | Highlighted text color |
| colorScale | String | Scales border color |
| colorCross | String | Crosshair color |
| colorCandleUp | String | Green candle color |
| colorCandleDw | String | Red candle color |
| colorWickUp | String | Green wick color  |
| colorWickDw | String | Red wick color  |
| colorWickSm | String | Scaled down wick color |
| colorVolUp | String | Green volume color |
| colorVolDw | String | Red volume color |
| colorPanel | String | Value bars color |
| colors  | Object | All-colors object, has a lower priority |
| font | String | Full font string, e.g. "11px Arial..." |
| data | Object | Data object |
| overlays | Array | List of custom overlay classes |
| chartConfig | Object | Overwrites chart config values |
| legendButtons | Array | Array of legend buttons ids [add, remove, display, up,down, settings] |
| toolbar | Boolean | Show toolbar (works with DataCube) |
| colorTbBack  | String | Toolbar background color |
| colorTbBorder  | String | Toolbar border color |
| indexBased  | Boolean | Index-based rendering mode (global setting) |
| extensions   | Array | Array of extensions |
| skin   | String | Skin ID (should be in the extensions) |
| timezone | Number | Shift from UTC, hours |


 ```
const chartEl = document.getElementById("chart")
const { dc, config, app, $refs } = new TradeChart(chartEl);
config.titleTxt = "name trade";
 ```


## dc (DataCube)

### add (side, overlay)

Adds a new overlay to the selected array reactively.

* **Arguments**:
    - side (String) "onchart" or "offchart"
    - overlay (Object) Overlay descriptor
* **Returns**: Overlay datacube id


*Example:*

```js
dc.add('onchart', {
    type: 'Spline',
    name: 'EMA 25',
    data: [ ... ],
    settings: {
        lineColor: 'green'
    }
}) // -> "onchart.Spline0"
```

### get (query)

Gets all objects matching the query.

* **Arguments**: query (String)
* **Returns**: Array of objects

```js
dc.get('onchart.Spline')  // -> [{id: "onchart.Spline0", name: "EMA", ...}]
```

### get_one (query)

Gets first object matching the query.

* **Arguments**: query (String)
* **Returns**: Array of objects

```js
dc.get_one('chart') // -> Chart object
dc.get_one('chart.data') // -> ohlcv data [ ... ]
dc.get_one('onchart.Spline')  // -> {id: "onchart.Spline0", name: "EMA", ...}
dc.get_one('onchart.Spline.data')  // -> [ ... ]
```

### set (query, data)

Changes values of selected objects.

* **Arguments**:
    - query (String)
    - data (Object|Array) New value

*Examples:*

```js
// Reset candles
dc.set('chart.data', ohlcv)

 // Change the entire chart object
dc.set('chart', {
    type: "Candles",
    data: [ ... ],
    settings: {}
})

// Apply new settings to all splines
dc.set('onchart.Spline.settings', {
    lineWidth: 2,
    color: 'green'
})

// Change the data of a specific overlay
dc.set('onchart.EMA0.data', [ ... ])
```

### merge (query, data)

Merges objects pulled by query with new data. Objects can be of type `Object` or` Array`.
If the type is `Array`, DC will first consider the data as time series and try to combine them by timestamp.

* **Arguments**:
    - query (String)
    - data (Object|Array) New value

*Note: time series must be sorted before merging*

*Examples:*

```js
// Merge new settings with existing ones
// (old properties will be overridden)
dc.merge('onchart.Spline.settings', {
    lineWidth: 2,
    color: 'green'
})

// Merge as time series
dc.get('chart.data') // -> [[10001, 1, 1, 1, 1 ], [10002, 1, 1, 1, 1 ]]
dc.merge('chart.data', [
    [10002, 2, 2, 2, 2 ], [10003, 3, 3, 3, 3 ]
])
dc.get('chart.data') // ->
// [[10001, 1, 1, 1, 1 ], [10002, 2, 2, 2, 2 ], [10003, 3, 3, 3, 3 ]]

```

### del (query)

Removes all overlays matching query.

* **Arguments**:
    - query (String)

```js
dc.del('.') // Remove everything (except the main chart)
dc.del('Spline') // Remove all overlays with id/name 'Spline'
```

### update (data)

Updates/appends a data point, depending on the timestamp (or current time).

* **Arguments**:
    - data (Object) Specifies an update, see examples below
* **Returns**: (Boolean) **true** if a new candle is formed

```js
// Update with a trade stream:
dc.update({
    price: 8800,
    volume: 22,
    'EMA': 8576, // query => value
    'BB': [8955, 8522] // query => [value, value, ...]
})
// Update with full candlestick:
dc.update({
    candle: [1573231698000, 8750, 8900, 8700, 8800, 1688],
    'EMA': 8576, // query => value
    'BB': [8955, 8522] // query => [value, value, ...]
})
// Update with ohlcv (auto time):
dc.update({
    candle: [8750, 8900, 8700, 8800, 1688],
    'EMA': 8576, // query => value
    'BB': [8955, 8522] // query => [value, value, ...]
})
```

### lock (query)

Excludes specific query from results (for all query-based methods).

* **Arguments**:
    - query (String)

```js
dc.lock('onchart.Spline')
dc.get('onchart.Spline')  // -> []
```

### unlock (query)

Enables the query back.

* **Arguments**:
    - query (String)

```js
dc.unlock('onchart.Spline')
dc.get('onchart.Spline')  // -> [{id: "onchart.Spline0", name: "EMA", ...}]
```

### show (query), hide (query)

Show/hide all overlays by query.

* **Arguments**:
    - query (String)

```js
dc.hide('.')
dc.show('onchart.Spline')
```

## Overlay (indicators)

### [ALMA](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/ALMA)
Arnaud Legoux Moving Average

```
dc.add("onchart", 
    {
        "name": "ALMA 10",
        "type": "ALMA",
        "data": [],
        "settings": {
            "color": "#559de0"
        }
    }
);
```

### [ATR](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/ATR)
Average True Range

```
dc.add("offchart", 
    {
        "name": "ALMA 10",
        "type": "ALMA",
        "data": [],
        "settings": {
            "color": "#559de0"
        }
    }
);
```

### [ATRp](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/ATRp)
Average True Range, %

```
dc.add("offchart", 
    {
        "name": "ATR% 15",
        "type": "ATRp",
        "data": [],
        "settings": {
            "color": "#f44336"
        }
    }
);
```

### [Area51 👽](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/Area51)
Gradient area chart 

```
dc.add("offchart", 
    {
        "name": "Area51",
        "type": "Area51",
        "data": [], // *
        "settings": {}
    }
);
```

### [BB](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/BB)
Bollinger Bands

```
dc.add("onchart",
    {
        "name": "Bollinger Bands",
        "type": "BB",
        "data": [],
        "settings": {
            "color": "#2cc6c9ab",
            "backColor": "#2cc6c90a"
        }
    }
);
```

### [BBW](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/BBW)
Bollinger Bands Width

```
dc.add("offchart",
    {
        "name": "Bollinger Bands Width",
        "type": "BBW",
        "data": [],
        "settings": {
            "color": "#2cc6c9ab"
        }
    }
);
```

### [CCI](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/CCI)
Commodity Channel Index

```
dc.add("offchart",
    {
        "name": "Commodity Channel Index",
        "type": "CCI",
        "data": [],
        "settings": {
            "color": "#e28a3dee",
            "backColor": "#e28a3d11",
            "bandColor": "#aaaaaa",
            "upper": 100,
            "lower": -100
        }
    }
);
```

### [CMO](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/CMO)
Chande Momentum Oscillator

```
dc.add("offchart",
    {
        "name": "Chande Momentum Oscillator, 10",
        "type": "CMO",
        "data": [],
        "settings": {
            "color": "#559de0"
        }
    }
);
```

### [COG](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/COG)
Center of Gravity

```
dc.add("offchart",
    {
        "name": "Center of Gravity",
        "type": "COG",
        "data": [],
        "settings": {
            "color": "#559de0"
        }
    }
);
```

### [DHistogram](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/DHistogram)
Double histogram allowing positive and negative values

```
dc.add("offchart",
    {
        "name": "DHistogram",
        "type": "DHistogram",
        "data": [], // *
        "settings": {
        }
    }
);
```

### [DMI](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/DMI)
Directional Movement Index

```
dc.add("offchart",
    {
        "name": "Directional Movement Index",
        "type": "DMI",
        "data": [],
        "settings": {
            "colors": ["#ef1360", "#3782f2", "#f48709"]
        }
    }
);
```

### [EMA](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/EMA)
Exponential Moving Average

```
dc.add("onchart",
    {
        "name": "EMA, 100",
        "type": "EMA",
        "data": [],
        "settings": {
            "color": "#f7890c",
            "length": 100
        }
    }
);
```

### [HMA](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/HMA)
Hull Moving Average

```
dc.add("onchart",
    {
        "name": "Hull Moving Average",
        "type": "HMA",
        "data": [],
        "settings": {
            "color": "#3af475",
            "length": 25
        }
    }
);
```

### [Histogram](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/Histogram)
Histogram plot

```
dc.add("offchart",
    {
        "name": "Histogram",
        "type": "Histogram",
        "data": [], // *
        "settings": {
            "lineWidth": 4
        }
    }
);
```

### [Ichi](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/Ichi)
Ichimoku Cloud based on scripts

```
dc.add("onchart",
    {
        "name": "Cloud",
        "type": "Ichi",
        "data": [],
        "settings": {}
    }
);
```

### [Ichimoku](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/Ichimoku)

```
dc.add("onchart",
    {
        "name": "Ichimoku",
        "type": "Ichimoku",
        "data": [], // *
        "settings": {
            "legend": true,
            "z-index": -1,
            "lineWidth": "1.25",
            "color": "#e584a6"
        }
    }
);
```

### [KC](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/KC)
Keltner Channels

```
dc.add("onchart",
    {
        "name": "Keltner Channles",
        "type": "KC",
        "data": [],
        "settings": {
            "color": "#4c8dffab",
            "backColor": "#4c8dff0a"
        }
    }
);
```

### [KCW](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/KCW)
Keltner Channels Width

```
dc.add("offchart",
    {
        "name": "Keltner Channles Width",
        "type": "KCW",
        "data": [],
        "settings": {
            "color": "#4c8dffab"
        }
    }
);
```

### [LongShortTrades](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/LongShortTrades)

```
dc.add("onchart",
    {
        "name": "LongShortTrades",
        "type": "LongShortTrades",
        "data": [], // *
        "settings": {
            "labelColor": "#888",
            "legend": false,
            "z-index": 5,
            "showPrevPivots": false
        }
    }
);
```

### [MACD](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/MACD)
Moving Average Convergence/Divergence

```
dc.add("offchart",
    {
        "name": "MACD",
        "type": "MACD",
        "data": [],
        "settings": {
            "histColors": [
                "#35a776", "#79e0b3", "#e54150", "#ea969e"
            ]
        }
    }
);
```

### [MFI](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/MFI)
Money Flow Index

```
dc.add("offchart",
    {
        "name": "Money Flow Index",
        "type": "MFI",
        "data": [],
        "settings": {
            "color": "#85c427ee",
            "backColor": "#85c42711",
            "bandColor": "#aaaaaa",
            "upper": 80,
            "lower": 20
        }
    }
);
```

### [MOM](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/MOM)
Momentum

```
dc.add("offchart",
    {
        "name": "Momentum",
        "type": "MOM",
        "data": [],
        "settings": {
            "color": "#bcc427ee"
        }
    }
);
```

### [Markers](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/Markers)
Interactive markers

```
dc.add("onchart",
        {
            "name": "Markers",
            "type": "Markers",

            "data": [
                [timesteamp, { "color": "#FF33FF", "sel": false, "$": 11860 }],
                [timesteamp, { "sel": false, "$": 11811, "text": "&" }],
                [timesteamp, { "color": "lightblue", "sel": true, "$": 11889, "text": "!!", "textColor": "black" }]
            ],
            "settings": {}

        }
    );
```

### [PlotCross](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/PlotCross)
Plot line with crosses

```
dc.add("onchart",
    {
        "name": "PlotCross",
        "type": "PlotCross",
        "data": [],
        "settings": {
            "lineWidth": 2
        }

    }
);
```

### [ROC](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/ROC)
Rate of Change

```
dc.add("offchart",
    {
        "name": "Rate of Change",
        "type": "ROC",
        "data": [],
        "settings": {
            "color": "#279fc4"
        }
    }

);
```

### [RSI](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/RSI)
Relative Strength Index

```
dc.add("offchart",
    {
        "name": "Relative Strength Index",
        "type": "RSI",
        "data": [],
        "settings": {}
    }

);
```

### [Ribbon](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/Ribbon)
Moving Average Ribbon

```
dc.add("onchart",
    {
        "name": "Moving Average Ribbon",
        "type": "Ribbon",
        "data": [],
        "settings": {
            "colors": ["#3aaaf4ee"],
            "start": 10,
            "number": 10,
            "step": 5
        }
    }
);
```

### [SAR](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/SAR)
Parabolic SAR

```
dc.add("onchart",
    {
        "name": "Parabolic SAR",
        "type": "SAR",
        "data": [],
        "settings": {
            "color": "#35a9c6"
        }
    }
);
```

### [SMA](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/SMA)
Simple Moving Average

```
dc.add("onchart",
    {
        "name": "Simple Moving Average, 25",
        "type": "SMA",
        "data": [],
        "settings": {
            "color": "#d1385c"
        }
    }
);
```

### [SWMA](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/SWMA)
Symmetrically Weighted Moving Average

```
dc.add("onchart",
    {
        "name": "Symmetrically Weighted Moving Average",
        "type": "SWMA",
        "data": [],
        "settings": {
            "color": "#e57440"
        }
    }
);
```

### [Stoch](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/Stoch)
Stochastic

```
dc.add("offchart",
    {
        "name": "Stochastic",
        "type": "Stoch",
        "data": [],
        "settings": {
        }
    }
);
```

### [TSI](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/TSI)
True Strength Index

```
dc.add("offchart",
    {
        "name": "True Strength Index",
        "type": "TSI",
        "data": [],
        "settings": {
            "colors": ["#3bb3e4", "#f7046d"]
        }
    }
);
```

### [TradesPlus](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/TradesPlus)
Trades overlay with stops

```
dc.add("onchart",
    {
        "type": "TradesPlus",
        "name": "TradesPlus",
        "data": [], // *
        "settings": {
            "z-index": 1
        }
    }
);
```

### [VWMA](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/VWMA)
Volume Weighted Moving Average

```
dc.add("onchart",
    {
        "name": "Volume Weighted Moving Average",
        "type": "VWMA",
        "data": [],
        "settings": {
            "color": "#db0670"
        }
    }
);
```

### [WilliamsR](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/WilliamsR)
Williams %R

```
dc.add("offchart",
    {
        "name": "Williams %R",
        "type": "WilliamsR",
        "data": [],
        "settings": {
            "upper": -20,
            "lower": -80,
            "color": "#0980e8"
        }
    }
);
```

### [XOhlcBars](https://github.com/tvjsx/tvjs-overlays/tree/master/src/overlays/XOhlcBars)
Bar Chart