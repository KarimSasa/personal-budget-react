import React from 'react';

function HomePage() {
    return (
        <main className="center" id="main">

        {/* This is a Semantic HTML Change: Replaced the div with section for the className page-area */}
        <section className="page-area">

            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            <article>
                <h1>Free</h1>
                <p>
                    This app is free!!! And you are the only one holding your data!
                </p>
            </article>
    
            <article>
                <h1>Stay on track</h1>
                <p>
                    Do you know where you are spending your money? If you really stop to track it down,
                    you would get surprised! Proper budget management depends on real data... and this
                    app will help you with that!
                </p>
            </article>
    
            <article>
                <h1>Alerts</h1>
                <p>
                    What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.
                </p>
            </article>
    
            <article>
                <h1>Results</h1>
                <p>
                    People who stick to a financial plan, budgeting every expense, get out of debt faster!
                    Also, they live happier lives... since they expend without guilt or fear... 
                    because they know it is all good and accounted for.
                </p>
            </article>
    
            {/* This is a Semantic HTML Change: Replaced div with figure for chart content, and added figcaption with styling */}
            <figure>
                <h1>Chart</h1>
                <p>
                    {/* This is an A11y Change: aria-live is added for dynamic content updates */}
                    <canvas id="myChart" width="400" height="400" aria-live="polite"></canvas>
                </p>
                <figcaption>Spending chart based on your personal budget data.</figcaption>
            </figure>

            <figure>
                <h1>D3JS Chart</h1>
                <p>
                    <div className="d3-chart-container">
                    {/* This is an A11y Change: aria-live is added for dynamic content updates */}
                    <svg id="d3Chart" width="960" height="500" aria-live="polite"></svg>
                    </div>
                </p>
                <figcaption>Spending D3JS chart based on your personal budget data.</figcaption>
            </figure>

        </section>

    </main>
    );
  }
  
  export default HomePage;
