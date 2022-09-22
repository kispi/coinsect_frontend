<template>
  <div class="view-economic-calendar">
    <div class="economic-calendar-widget">
      <div class="title">
        Investing.com에서 제공하는 경제 캘린더에서 중요성이 높은 금주의 이벤트들만 정리해서 보여줍니다. 시간대는 KST(한국)입니다.
      </div>
      <iframe
        src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&importance=3&features=datepicker,timezone&countries=110,43,17,42,5,178,32,12,26,36,4,72,10,14,48,35,37,6,122,41,22,11,25,39&calType=week&timeZone=88&lang=18"
        width="100%"
        height="1600"
        frameborder="0"
        allowtransparency="true"
        marginwidth="0"
        marginheight="0">
      </iframe>
      <PoweredBy
        :by="'Investing.com'"
        :link="'https://kr.investing.com/economic-calendar/'"
        :imgUrl="'https://play-lh.googleusercontent.com/9MD3biGQRiYH8NdM6MT4uU9CFEBdeyjwA5OV5Ucab0vjF6O1PD7qIF63FhSk-eqksA=w480-h960-rw'"
        class="m-t-24 display-table"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.view-economic-calendar {
  .economic-calendar-widget {
    margin: auto;
    border-radius: 8px;
    border: 8px double var(--border-base);
    background: var(--white);
    padding: 16px;
    max-width: 640px;

    .title {
      color: var(--black);
      font-size: 16px;
      margin-bottom: 40px;
    }

    iframe {
      margin: auto;
      display: table;
    }

    .powered-by {
      background: var(--background-base);
      padding: 8px;
      border-radius: 8px;
    }
  }
}
</style>