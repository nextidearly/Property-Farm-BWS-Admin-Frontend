import React, { useEffect, useState, useContext, useRef } from "react";
import { Card, CardBody, CardExpandToggler } from "../../components/card/card";
import Chart from "react-apexcharts";
import { AppSettings } from "./../../config/app-settings.js";
import { Tooltip } from "bootstrap";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import "datatables.net-fixedcolumns-bs5/css/fixedColumns.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";

const $ = require("jquery");
$.DataTable = require("datatables.net");
require("datatables.net-bs5");
require("datatables.net-buttons");
require("datatables.net-buttons/js/buttons.colVis.min.js");
require("datatables.net-buttons/js/buttons.html5.min.js");
require("datatables.net-buttons/js/buttons.print.min.js");
require("datatables.net-buttons-bs5");
require("datatables.net-responsive");
require("datatables.net-responsive-bs5");
require("datatables.net-fixedcolumns");
require("datatables.net-fixedcolumns-bs5");

function Home() {
  const context = useContext(AppSettings);
  const tableRef = useRef();

  const [statsData, setStatsData] = useState();
  const [chartOptions, setChartOptions] = useState(getChartOptions());
  const [serverChartOptions, setServerChartOptions] = useState(
    getServerChartOptions()
  );

  function getChartOptions() {
    var themeColor = getComputedStyle(document.body)
      .getPropertyValue("--bs-theme")
      .trim();
    var themeColorRgb = getComputedStyle(document.body)
      .getPropertyValue("--bs-theme-rgb")
      .trim();

    return {
      bar: {
        colors: [themeColor],
        chart: { sparkline: { enabled: true } },
        tooltip: {
          x: { show: false },
          y: {
            title: {
              formatter: function (seriesName) {
                return "";
              },
            },
          },
        },
      },
      line: {
        colors: [themeColor],
        chart: { sparkline: { enabled: true } },
        stroke: { curve: "straight", width: 2 },
        tooltip: {
          x: { show: false },
          y: {
            title: {
              formatter: function (seriesName) {
                return "";
              },
            },
          },
        },
      },
      pie: {
        colors: [
          "rgba(" + themeColorRgb + ", 1)",
          "rgba(" + themeColorRgb + ", .75)",
          "rgba(" + themeColorRgb + ", .5)",
        ],
        chart: { sparkline: { enabled: true } },
        stroke: { show: false },
        tooltip: {
          x: { show: false },
          y: {
            title: {
              formatter: function (seriesName) {
                return "";
              },
            },
          },
        },
      },
      donut: {
        colors: [
          "rgba(" + themeColorRgb + ", .15)",
          "rgba(" + themeColorRgb + ", .35)",
          "rgba(" + themeColorRgb + ", .55)",
          "rgba(" + themeColorRgb + ", .75)",
          "rgba(" + themeColorRgb + ", .95)",
        ],
        chart: { sparkline: { enabled: true } },
        stroke: { show: false },
        tooltip: {
          x: { show: false },
          y: {
            title: {
              formatter: function (seriesName) {
                return "";
              },
            },
          },
        },
      },
    };
  }

  function getServerChartOptions() {
    var borderColor = getComputedStyle(document.body)
      .getPropertyValue("--bs-border-color")
      .trim();
    var bodyColor = getComputedStyle(document.body)
      .getPropertyValue("--bs-body-color")
      .trim();
    var inverseRgb = getComputedStyle(document.body)
      .getPropertyValue("--bs-inverse-rgb")
      .trim();
    var themeColor = getComputedStyle(document.body)
      .getPropertyValue("--bs-theme")
      .trim();
    var themeFont = getComputedStyle(document.body)
      .getPropertyValue("--bs-body-font-family")
      .trim();

    return {
      chart: { toolbar: { show: false } },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "55%", endingShape: "rounded" },
      },
      dataLabels: { enabled: false },
      grid: { show: true, borderColor: borderColor },
      stroke: { show: false },
      colors: ["rgba(" + inverseRgb + ", .15)", themeColor],
      legend: { fontFamily: themeFont, labels: { colors: bodyColor } },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: { show: false },
        axisBorder: {
          show: true,
          color: borderColor,
          height: 1,
          width: "100%",
          offsetX: 0,
          offsetY: -1,
        },
        axisTicks: {
          show: true,
          borderType: "solid",
          color: borderColor,
          height: 6,
          offsetX: 0,
          offsetY: 0,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: bodyColor,
            fontSize: "12px",
            fontFamily: themeFont,
            fontWeight: 400,
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      fill: { opacity: 0.65 },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    };
  }

  useEffect(() => {
    context.setAppContentClass("py-3");
    context.setAppContentFullHeight(true);

    fetch("/assets/data/dashboard/stats.json")
      .then((res) => res.json())
      .then((result) => {
        setStatsData(result);
      });

    document.addEventListener("theme-reload", () => {
      setServerChartOptions(getServerChartOptions());
      setChartOptions(getChartOptions());
    });

    var height = $(window).height() - $("#header").height() - 165;
    var options = {
      dom: "<'row mb-3'<'col-7 col-md-6 d-flex justify-content-start'f><'col-5 col-md-6 text-end'B>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5 fs-12px'i><'col-sm-12 col-md-7 fs-12px'p>>",
      scrollY: height,
      scrollX: true,
      paging: false,
      fixedColumns: {
        left: 3,
      },
      order: [[1, "asc"]],
      columnDefs: [{ targets: "no-sort", orderable: false }],
      buttons: [
        {
          extend: "csv",
          text: '<i className="fa fa-download fa-fw me-1"></i> Export CSV',
          className: "btn btn-outline-default btn-sm text-nowrap rounded-2",
          footer: true,
        },
      ],
    };

    if ($(window).width() < 767) {
      options.fixedColumns = { left: 2 };
    }
    if (tableRef.current) {
      tableRef.current.destroy();
    }
    setTimeout(function () {
      tableRef.current = $("#datatable").DataTable(options);
      $('[data-id="table"]').removeClass("d-none");
      $(window).trigger("resize");
    }, 150);

    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });

    return function cleanUp() {
      $(".dataTables_wrapper table").DataTable().destroy(true);

      context.setAppContentClass("");
      context.setAppContentFullHeight(false);
    };

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Card>
        <div className="row gx-0">
          <div className="col-xl-7 position-relative">
            <div className="p-5">
              <div className="display-6 fw-bold mb-3">
                Tokenized Real Estate Shares on Bitcoin Blockchain
              </div>
              <div className="fs-13px mb-4 font-monospace">
                Experience the future of real estate investment with our unique
                platform. Buy shares in vacation properties inscribed directly
                on the Bitcoin blockchain as Ordinal inscriptions. Each share
                represents a stake in real-world property, democratizing
                investment and ensuring transparent and secure ownership.
              </div>
            </div>
          </div>
          <div className="col-xl-5 d-xl-block d-none">
            <div className="ms-n5 h-100 d-flex align-items-center justify-content-center p-3">
              <img src="/assets/img/pricing/img-1.svg" alt="" height="260" />
            </div>
          </div>
        </div>
      </Card>

      <div className="row mt-4">
        {statsData &&
          statsData.length > 0 &&
          statsData.map((stat, index) => (
            <div className="col-xl-3 col-lg-6" key={index}>
              <Card className="mb-3">
                <CardBody>
                  <div className="d-flex fw-bold small mb-3">
                    <span className="flex-grow-1">{stat.title}</span>
                    <CardExpandToggler />
                  </div>
                  <div className="row align-items-center mb-2">
                    <div className="col-7">
                      <h3 className="mb-0">{stat.total}</h3>
                    </div>
                    <div className="col-5">
                      <div className="mt-n2">
                        <Chart
                          type={stat.chartType}
                          height={stat.chartHeight}
                          options={chartOptions[stat.chartType]}
                          series={stat.chartData}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="small text-inverse text-opacity-50 text-truncate">
                    {stat.info.length > 0 &&
                      stat.info.map((info, index) => (
                        <div key={index}>
                          <i className={info.icon}></i> {info.text}
                        </div>
                      ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
      </div>

      <div className="data-management d-none" data-id="table">
        <table
          className="table table-bordered table-xs w-100 fw-semibold text-nowrap mb-3"
          id="datatable"
        >
          <thead>
            <tr>
              <th>No.</th>
              <th>Address</th>
              <th>Total Earning</th>
              <th>01/2024</th>
              <th>02/2024</th>
              <th>03/2024</th>
              <th>04/2024</th>
              <th>Holding Amount</th>
              <th>Percenage</th>
            </tr>
          </thead>
          <tbody className="text-body">
            <tr>
              <td>1.</td>
              <td>bc1plj28...ukpsrjjj37</td>
              <td>$10,235</td>
              <td>$100.2</td>
              <td>$56.3</td>
              <td>$98.3</td>
              <td>$134.2</td>
              <td className="text-success">2100</td>
              <td className="text-success">1%</td>
            </tr>
            <tr>
              <td>2.</td>
              <td>bc1q...klr78</td>
              <td>$12,500</td>
              <td>$200.5</td>
              <td>$80.1</td>
              <td>$150.7</td>
              <td>$175.9</td>
              <td className="text-success">4200</td>
              <td className="text-success">2%</td>
            </tr>
            <tr>
              <td>3.</td>
              <td>bc1q...kjd65</td>
              <td>$8,750</td>
              <td>$130.3</td>
              <td>$60.8</td>
              <td>$120.5</td>
              <td>$140.2</td>
              <td className="text-success">3150</td>
              <td className="text-success">1.5%</td>
            </tr>
            <tr>
              <td>4.</td>
              <td>bc1q...qj67</td>
              <td>$9,600</td>
              <td>$115.7</td>
              <td>$75.4</td>
              <td>$110.6</td>
              <td>$145.3</td>
              <td className="text-success">3600</td>
              <td className="text-success">1.7%</td>
            </tr>
            <tr>
              <td>5.</td>
              <td>bc1q...lr89</td>
              <td>$11,300</td>
              <td>$140.9</td>
              <td>$95.6</td>
              <td>$130.8</td>
              <td>$160.4</td>
              <td className="text-success">5250</td>
              <td className="text-success">2.5%</td>
            </tr>
            <tr>
              <td>6.</td>
              <td>bc1q...klp90</td>
              <td>$7,450</td>
              <td>$90.4</td>
              <td>$50.3</td>
              <td>$100.2</td>
              <td>$120.5</td>
              <td className="text-success">1575</td>
              <td className="text-success">0.75%</td>
            </tr>
            <tr>
              <td>7.</td>
              <td>bc1q...djr91</td>
              <td>$13,250</td>
              <td>$175.8</td>
              <td>$85.9</td>
              <td>$145.7</td>
              <td>$185.3</td>
              <td className="text-success">6300</td>
              <td className="text-success">3%</td>
            </tr>
            <tr>
              <td>8.</td>
              <td>bc1q...lj92</td>
              <td>$10,850</td>
              <td>$125.6</td>
              <td>$65.4</td>
              <td>$135.8</td>
              <td>$155.2</td>
              <td className="text-success">4200</td>
              <td className="text-success">2%</td>
            </tr>
            <tr>
              <td>9.</td>
              <td>bc1q...ljr93</td>
              <td>$14,700</td>
              <td>$190.7</td>
              <td>$105.8</td>
              <td>$165.7</td>
              <td>$200.3</td>
              <td className="text-success">7350</td>
              <td className="text-success">3.5%</td>
            </tr>
            <tr>
              <td>10.</td>
              <td>bc1q...lkr94</td>
              <td>$6,300</td>
              <td>$80.5</td>
              <td>$45.2</td>
              <td>$95.3</td>
              <td>$110.4</td>
              <td className="text-success">1050</td>
              <td className="text-success">0.5%</td>
            </tr>
            <tr>
              <td>11.</td>
              <td>bc1q...krj95</td>
              <td>$9,900</td>
              <td>$110.8</td>
              <td>$70.6</td>
              <td>$115.7</td>
              <td>$135.8</td>
              <td className="text-success">3675</td>
              <td className="text-success">1.8%</td>
            </tr>
            <tr>
              <td>12.</td>
              <td>bc1q...lkj96</td>
              <td>$15,300</td>
              <td>$195.9</td>
              <td>$110.7</td>
              <td>$170.8</td>
              <td>$210.5</td>
              <td className="text-success">7350</td>
              <td className="text-success">3.5%</td>
            </tr>
            <tr>
              <td>13.</td>
              <td>bc1q...ljk97</td>
              <td>$7,800</td>
              <td>$95.4</td>
              <td>$55.3</td>
              <td>$105.7</td>
              <td>$125.8</td>
              <td className="text-success">2100</td>
              <td className="text-success">1%</td>
            </tr>
            <tr>
              <td>14.</td>
              <td>bc1q...lkj98</td>
              <td>$16,200</td>
              <td>$205.8</td>
              <td>$120.9</td>
              <td>$180.7</td>
              <td>$220.6</td>
              <td className="text-success">8400</td>
              <td className="text-success">4%</td>
            </tr>
            <tr>
              <td>15.</td>
              <td>bc1q...lj99</td>
              <td>$11,900</td>
              <td>$145.9</td>
              <td>$90.3</td>
              <td>$135.8</td>
              <td>$165.4</td>
              <td className="text-success">5250</td>
              <td className="text-success">2.5%</td>
            </tr>
            <tr>
              <td>16.</td>
              <td>bc1q...dlj0</td>
              <td>$8,500</td>
              <td>$105.6</td>
              <td>$65.8</td>
              <td>$120.5</td>
              <td>$140.3</td>
              <td className="text-success">3150</td>
              <td className="text-success">1.5%</td>
            </tr>
            <tr>
              <td>17.</td>
              <td>bc1q...dlk1</td>
              <td>$14,100</td>
              <td>$180.7</td>
              <td>$100.5</td>
              <td>$160.8</td>
              <td>$190.4</td>
              <td className="text-success">6300</td>
              <td className="text-success">3%</td>
            </tr>
            <tr>
              <td>18.</td>
              <td>bc1q...ljk2</td>
              <td>$13,600</td>
              <td>$175.5</td>
              <td>$95.7</td>
              <td>$150.9</td>
              <td>$185.6</td>
              <td className="text-success">5775</td>
              <td className="text-success">2.7%</td>
            </tr>
            <tr>
              <td>19.</td>
              <td>bc1q...ljk3</td>
              <td>$9,300</td>
              <td>$120.4</td>
              <td>$70.8</td>
              <td>$110.7</td>
              <td>$140.6</td>
              <td className="text-success">3675</td>
              <td className="text-success">1.8%</td>
            </tr>
            <tr>
              <td>20.</td>
              <td>bc1q...ljk4</td>
              <td>$7,200</td>
              <td>$85.3</td>
              <td>$50.7</td>
              <td>$95.6</td>
              <td>$115.4</td>
              <td className="text-success">1575</td>
              <td className="text-success">0.75%</td>
            </tr>
            <tr>
              <td>21.</td>
              <td>bc1q...ljk5</td>
              <td>$16,800</td>
              <td>$210.7</td>
              <td>$125.6</td>
              <td>$185.8</td>
              <td>$230.5</td>
              <td className="text-success">8400</td>
              <td className="text-success">4%</td>
            </tr>
            <tr>
              <td>22.</td>
              <td>bc1q...ljk6</td>
              <td>$12,400</td>
              <td>$165.8</td>
              <td>$90.6</td>
              <td>$140.7</td>
              <td>$175.8</td>
              <td className="text-success">4725</td>
              <td className="text-success">2.2%</td>
            </tr>
            <tr>
              <td>23.</td>
              <td>bc1q...ljk7</td>
              <td>$11,800</td>
              <td>$150.7</td>
              <td>$85.4</td>
              <td>$130.5</td>
              <td>$160.3</td>
              <td className="text-success">5250</td>
              <td className="text-success">2.5%</td>
            </tr>
            <tr>
              <td>24.</td>
              <td>bc1q...ljk8</td>
              <td>$9,000</td>
              <td>$110.5</td>
              <td>$60.3</td>
              <td>$115.4</td>
              <td>$135.7</td>
              <td className="text-success">3150</td>
              <td className="text-success">1.5%</td>
            </tr>
            <tr>
              <td>25.</td>
              <td>bc1q...ljk9</td>
              <td>$14,400</td>
              <td>$185.6</td>
              <td>$100.5</td>
              <td>$160.7</td>
              <td>$190.6</td>
              <td className="text-success">6300</td>
              <td className="text-success">3%</td>
            </tr>
            <tr>
              <td>26.</td>
              <td>bc1q...ljl0</td>
              <td>$10,500</td>
              <td>$135.7</td>
              <td>$75.6</td>
              <td>$125.4</td>
              <td>$150.7</td>
              <td className="text-success">3675</td>
              <td className="text-success">1.8%</td>
            </tr>
            <tr>
              <td>27.</td>
              <td>bc1q...ljl1</td>
              <td>$15,200</td>
              <td>$200.6</td>
              <td>$115.4</td>
              <td>$170.7</td>
              <td>$205.8</td>
              <td className="text-success">7350</td>
              <td className="text-success">3.5%</td>
            </tr>
            <tr>
              <td>28.</td>
              <td>bc1q...ljl2</td>
              <td>$8,100</td>
              <td>$100.4</td>
              <td>$55.2</td>
              <td>$110.5</td>
              <td>$125.4</td>
              <td className="text-success">2100</td>
              <td className="text-success">1%</td>
            </tr>
            <tr>
              <td>29.</td>
              <td>bc1q...ljl3</td>
              <td>$13,100</td>
              <td>$170.6</td>
              <td>$95.3</td>
              <td>$150.4</td>
              <td>$180.7</td>
              <td className="text-success">5775</td>
              <td className="text-success">2.7%</td>
            </tr>
            <tr>
              <td>30.</td>
              <td>bc1q...ljl4</td>
              <td>$16,500</td>
              <td>$215.5</td>
              <td>$130.4</td>
              <td>$185.6</td>
              <td>$225.3</td>
              <td className="text-success">8400</td>
              <td className="text-success">4%</td>
            </tr>
            <tr>
              <td>31.</td>
              <td>bc1q...ljl5</td>
              <td>$7,600</td>
              <td>$95.2</td>
              <td>$50.5</td>
              <td>$105.3</td>
              <td>$120.6</td>
              <td className="text-success">1575</td>
              <td className="text-success">0.75%</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th></th>
              <th className="text-success">$5m earned</th>
              <th className="text-success">$10.2k earned</th>
              <th className="text-success">$8.54k earned</th>
              <th className="text-success">$23.14k earned</th>
              <th className="text-success">$6.4k earned</th>
              <th></th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Home;
