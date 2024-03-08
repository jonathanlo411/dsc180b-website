<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let results: Array<Record<string, number>> | Array<Record<string, string>>;
  export let headers: Array<string>;
  export let sentences: Array<string>;

  let chartInstance: Chart | null = null;

  let getGradientColor = function(start_color: string, end_color: string, percent: number) {
    // strip the leading # if it's there
    start_color = start_color.replace(/^\s*#|\s*$/g, '');
    end_color = end_color.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (start_color.length == 3) {
      start_color = start_color.replace(/(.)/g, '$1$1');
    }

    if (end_color.length == 3) {
      end_color = end_color.replace(/(.)/g, '$1$1');
    }

    // get colors
    var start_red = parseInt(start_color.substr(0, 2), 16),
      start_green = parseInt(start_color.substr(2, 2), 16),
      start_blue = parseInt(start_color.substr(4, 2), 16);

    var end_red = parseInt(end_color.substr(0, 2), 16),
      end_green = parseInt(end_color.substr(2, 2), 16),
      end_blue = parseInt(end_color.substr(4, 2), 16);

    // calculate new color
    var diff_red: any = end_red - start_red;
    var diff_green: any = end_green - start_green;
    var diff_blue: any = end_blue - start_blue;

    diff_red = ((diff_red * percent) + start_red).toString(16).split('.')[0];
    diff_green = ((diff_green * percent) + start_green).toString(16).split('.')[0];
    diff_blue = ((diff_blue * percent) + start_blue).toString(16).split('.')[0];

    // ensure 2 digits by color
    if (diff_red.length == 1) diff_red = '0' + diff_red
    if (diff_green.length == 1) diff_green = '0' + diff_green
    if (diff_blue.length == 1) diff_blue = '0' + diff_blue

    return '#' + diff_red + diff_green + diff_blue;
  };

  onMount(() => {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradStart = getComputedStyle(document.documentElement).getPropertyValue('--highlight');
    const gradEnd = getComputedStyle(document.documentElement).getPropertyValue('--font-color');
    console.log(gradEnd)
    
    const data = {
      labels: headers,
      datasets: sentences.map((sentence, index) => ({
        label: sentence,
        data: Object.values(results[index]),
        backgroundColor: getGradientColor(gradStart, gradEnd, (index/4)),
      })),
    };

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Scores with Identifier by Model'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Scores',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Models',
            },
            grid: {
              lineWidth: 2, // Adjust line width to make it bold
            },
          },
        },
      },
    });
  });
</script>

<canvas id="barChart" />

<style>
  canvas {
    background-color: white;
    margin-top: 2rem;
    border-radius: 5px;
  }
</style>
