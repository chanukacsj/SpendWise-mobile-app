import { View, Text, ScrollView, Alert } from "react-native";
import React, { use, useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BarChart } from "react-native-gifted-charts";
import { get } from "axios";
import { useAuth } from "@/context/AuthContext";
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from "@/services/transactionService";
import TransactionList from "@/components/TransactionList";

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);

  const [chartLoading, setChartLoading] = useState(false);
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (activeIndex == 0) {
      getWeeklyStats();
    }
    if (activeIndex == 1) {
      getMonthlyStats();
    }
    if (activeIndex == 2) {
      getYearlyStats();
    }
  }, [activeIndex]);

  const getWeeklyStats = async () => {
    setChartLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.message);
    }
  };
  const getMonthlyStats = async () => {
     setChartLoading(true);
    let res = await fetchMonthlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.message);
    }
  };

  const getYearlyStats = async () => {
      setChartLoading(true);
    let res = await fetchYearlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Error", res.message);
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 px-4">
        <View>
          <Text className="text-white text-3xl text-center">Statistics</Text>
        </View>
        <ScrollView
          className="gap-4 pt-5 pb-4 "
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);

            }}
          />
          <View className="justify-center items-center relative mt-5 ">
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={22}
                spacing={16}
                roundedTop
                roundedBottom
                barBorderRadius={8}
                hideRules={false}
                rulesType="solid"
                rulesColor="rgba(255,255,255,0.1)"
                rulesThickness={1}
                yAxisLabelPrefix=""
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={45}
                yAxisTextStyle={{ color: "#9ca3af", fontSize: 10 }}
                xAxisLabelTextStyle={{
                  color: "white",
                  fontSize: 13,
                  marginTop: 6,
                }}
                noOfSections={4}
                stepHeight={60}
                stepValue={25000}
                maxValue={100000}
                initialSpacing={20}
                disablePress
                showGradient
                isAnimated
                animationDuration={900}
                // Reference lines
                showReferenceLine1
                referenceLine1Position={50000}
                referenceLine1Config={{
                  color: "#6b7280", // neutral grey
                  dashWidth: 4,
                  dashGap: 6,
                }}
              />
            ) : (
              <View className="w-full h-[300px] justify-center items-center">
                <Text className="text-white text-2xl font-semibold">
                  No Data
                </Text>
              </View>
            )}
            {chartLoading && (
              <View className="absolute top-0 left-0 right-0 bottom-0 flex-1 justify-center items-center">
                <Text className="text-white text-2xl font-semibold">
                  Loading...
                </Text>
              </View>
            )}
          </View>
          <View className="mt-5">
            <TransactionList title="Transactions" data={transactions} emptyListMessage="No Transactions Found" />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;
