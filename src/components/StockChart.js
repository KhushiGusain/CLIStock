import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TimeframeButton from './TimeframeButton';
import ChartPlaceholder from './ChartPlaceholder';

const StockChart = ({
  chartData = [],
  loading = false,
  selectedTimeframe,
  setSelectedTimeframe,
  timeframes = [],
  theme,
  onDataPointClick,
  selectedDataPoint,
  setSelectedDataPoint,
  styles = {},
  screenWidth = 320,
}) => {
  if (loading) {
    return <ChartPlaceholder message="Loading chart..." iconName="show-chart" theme={theme} style={styles.chartPlaceholder} />;
  }

  if (!chartData.length) {
    return <ChartPlaceholder message="Chart data unavailable" subtext="Please try again later" iconName="show-chart" theme={theme} style={styles.chartPlaceholder} />;
  }

  const startPrice = chartData[0]?.price || 0;
  const endPrice = chartData[chartData.length - 1]?.price || 0;
  const priceChange = endPrice - startPrice;
  const percentageChange = startPrice > 0 ? ((priceChange / startPrice) * 100) : 0;
  const isPositive = priceChange >= 0;

  return (
    <View style={[styles.chartContainer, { backgroundColor: theme.card }]}> 
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Price Chart</Text>
      <LineChart
        data={{
          labels: chartData.map((_, index) => {
            if (index % Math.ceil(chartData.length / 6) === 0) {
              return new Date(chartData[index].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            return '';
          }),
          datasets: [
            {
              data: chartData.map(point => point.price),
              color: (opacity = 1) => `rgba(17, 185, 129, 0.9)`,
              strokeWidth: 2,
              withDots: false,
            },
          ],
        }}
        width={screenWidth - 72}
        height={180}
        yAxisLabel="$"
        yAxisSuffix=""
        yAxisInterval={1}
        onDataPointClick={onDataPointClick}
        chartConfig={{
          backgroundColor: theme.card,
          backgroundGradientFrom: theme.card,
          backgroundGradientTo: theme.card,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(17, 185, 129, ${opacity})`,
          labelColor: (opacity = 1) => theme.secondaryText,
          style: { borderRadius: 16 },
          propsForDots: { r: '0', strokeWidth: '0', stroke: '#11B981' },
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
      {selectedDataPoint && (
        <View style={[styles.selectedPointContainer, { backgroundColor: theme.card }]}> 
          <Text style={styles.selectedPointPrice}>
            ${selectedDataPoint.value.toFixed(2)}
          </Text>
          <Text style={[styles.selectedPointDate, { color: theme.secondaryText }]}> 
            {new Date(selectedDataPoint.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
          <TouchableOpacity style={styles.clearSelectionButton} onPress={() => setSelectedDataPoint(null)}>
            <Text style={[styles.clearSelectionText, { color: theme.secondaryText }]}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.chartInfo}>
        <Text style={[styles.chartInfoText, { color: theme.secondaryText }]}> 
          {selectedTimeframe} performance • {chartData.length} data points
        </Text>
        <View style={styles.performanceContainer}>
          <Text style={[styles.performanceText, { color: isPositive ? '#11B981' : '#F75555' }]}> 
            {isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)} ({isPositive ? '+' : ''}{percentageChange.toFixed(2)}%)
          </Text>
          <Text style={[styles.performanceLabel, { color: theme.secondaryText }]}> 
            {isPositive ? 'Gained' : 'Lost'} in {selectedTimeframe}
          </Text>
        </View>
        <Text style={[styles.chartLatestPrice, { color: theme.text }]}> 
          Latest: ${endPrice.toFixed(2)} on{' '}
          {new Date(chartData[chartData.length - 1]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
      </View>
      <View style={styles.timeframeContainer}>
        {timeframes.map((timeframe) => (
          <TimeframeButton
            key={timeframe}
            label={timeframe}
            active={selectedTimeframe === timeframe}
            onPress={() => setSelectedTimeframe(timeframe)}
          />
        ))}
      </View>
    </View>
  );
};

export default StockChart; 