import React, { useState, useEffect, useRef } from "react";

// Firebase REST API (بدون npm - يعمل في أي مكان)
const FB_URL = "https://moi-attendance-c86f3-default-rtdb.asia-southeast1.firebasedatabase.app/attendance_data.json";

async function fbRead() {
  try {
    const r = await fetch(FB_URL);
    if (!r.ok) return null;
    return await r.json();
  } catch(e) { return null; }
}

async function fbWrite(data) {
  try {
    await fetch(FB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch(e) { console.log("Firebase write error:", e); }
}
const MOI_LOGO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUUEhMTFREWGR4bGRgYGR4gIBodHhsiIiAbHx8gIiggHh4nHx8XITEiJyktLi4uICczODMsOCowLisBCgoKDg0OGhAQGzUlHSUtMC0vMDcvLSsrLS0vNy0wMC8tLi0tLy0tLysyKzUtLzU1LS0tKy0tLy0tLS0tLS0tLf/AABEIAOkA2QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABQYDBAcCAQj/xABIEAACAQMCBAMEBQgIBQMFAAABAgMABBESIQUTMUEGIlEUMmFxByNCgZEWM1JTYqGx0hUXVHKSo8HRc5Oi4fAkgrI0NUNEs//EABoBAQADAQEBAAAAAAAAAAAAAAABAwQCBQb/xAAwEQACAQIEAwUIAwEAAAAAAAAAAQIDEQQSITETQVEFFWGR4SIycaGxwdHwgZLxQv/aAAwDAQACEQMRAD8A7jSlKAUpSgFKUoBSlKAUpSgFKUoDT4rfcmPVp1MSFRemWY4UE9AM96iXjmtAbh5DKp3nXsP2ox207DT3A9akPEkOu2lGQCF1KT2ZfMN+24FaPF7gTRWy9FuHjJzt5QNZHzOAMfGgJ8GvtKUApSlAKUpQClKUApSlAKUpQClKUApSlAKUpQClKUApSlAKxzzqgy7Kq+rEAfvrV4temNQEAaV20RqehY75P7IALH4CoCRNEkqyLmVY9Qu58aNRxgKCNKLk9B6HINATF1x2LTiB45pWOlERwck+uM4UAEk+gqJvoGYIxL3hZ9L8uQqkfrhUPb1bPxNYbLiJyZWK3L28G/KxgtI5zjA7Kq5IHrtW1wjhkLYjWNkh0LK0TE+Z5MgBs9QoT3em4yNqA9WnDA1w6GF/Z0AZWMrsjttsULFTg57bafiKjeBx3c08kd2rtAQdYceXPbQfn0K/P0qfveFpEplt0WOVBqAQaQ4G5RgNiCNsncdRWqY5VLMtwzC6dRGCPzSkFiRkkZCA4264zmgND2M6J2e2laRDiMGeQtIM4z73Yb7DfoK3Yne3VXVmPkDyWzvrdF7lCfN5fQ7HG2DUkOA22MclCf0iMvn11+9n45zUMGWGZHMUk04kMBkBOy7FWbsW0MuTtnegJxONWxIAuIcnoOYufwzmt4HPTpVNt59LpAJrdI4ppFeOTTl01ZUDI/RJUdPvrZs5Hj5ssMDxRxuQ8J92RR1eMYGlgN8Dynpv1AFqpXiGUMoZTlWAIPqD0Ne6AUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoCI4jGWuYRkrmKbSR2byDI+IBNRfC40L26vMLpVEqhzuOblSBuTuE14JJ2zU3xi3ZlV4xmWJtaj9LYhk/9ykj54PaohYeaVjt4VS2Yc1ZlwCkoPdfUEBSvpkfCgNniKSLO3J0rJLBhCemqNv44f91ZeF8xZysxBleCMkjoWVmDY/xJ+NY7iZpotYXF1btqMfxA8yj1V0LaT8R6VGRTJDynW4edxqmOrOeRJgNjr7pAfGfsnagLXdOFRiegUk/cKqnB2jEluq6+YpjWXVnGr2Zsac7dj0qd48+qAopzziIxj0c4JHyXU33VHX0lxiZpIlWKB0kiKndlU+bueqZ7DrjegLJVcgFw7F4CgRrluZq7qmmPbb9hv3fGpXi17y4sphpG8sY/Sdun3dz8ATVcjjGmMW1y78xOQFGQAR+cmwe4GT06kb4NATHBYkeF3dVKSySP5gCNJYhTv2KhTUbwOPU9ti5K6Y2bkfpIWbQTv2Ur1BO3apG7QSYtYtokAEpHZQNoh8WGM+i/MVoq8jqNUCQ3smY1IwSkQxmQnsBnA9TjsaAlPDH/ANLF6YOn+7qOn/pxUpWO3hVEVFGFUBQPgBgVkoBSlKAUpSgFKUoBSlKAUpSgFfGzjbrX2lAc8s5L2K/wwLSP7w+wyeoPZR2PUdOpIM74p4tJ7NzLRlZMlXkU5KY22/37bEdcjX4/4kh5rWz6hGQVeRTgqTjp6qO/r/GNs4jw0O0riRJPKka9JBtlznIGAcY759N6kFi4Zx4mz58qNqVSSAN3Ax51H6O436DftvWbw1x1btCcaZFPmXOcA9DnuMfvBqrcVWbnx3dqzTRyYVRj3fWJh2Xr8u++5z3HL4eTPChdnbQw1eWHoWjOOrememPhuBcb++jhQvI2lB1PXr02G9Vq84zGmmWMssVwDqB2VmGzbj83KNt/dON8Y1COeF3ueYNU1pcodTMcBE7gk7KYzuPw65r7ZQRRhrM/XyH62PUMRl9GVC4OSGXOTnFAb9gzMYxaKVaMFeZO4y6g7qUXLMATkHy47bHfV4fcx+0Nbm4nDF2H1aqiaicsqk6nC6s9wM1F2MRuHiuACGRwsgiQ58uGTSq9Mr5N8Aad+tTZgjF0JFhjjnc6lEsu+TnzCNNXXfqw3+NAR3hy5imnELQNoGrRmWQlNIPUFtI2yNgMZxX3w5ci4neOSABNLHCtJlcdj5t/TtvWd+NgK06zIMsFYxWwBJIzuXbJGAeten40UMv/AKqfMeNX1EO/mC7dCevftQGnwO/jmlbUskKRozqySyEooAyCGJHT0A6Ywa3eDXTTvI1tN9aE0gXEa5Ck5ypjOB5sE5U5OM5r1bX+5RZLdmlTWwe3KalKFjqZGIzpz1FeLOzj5EywxEc0aebFJzQMb6SNpAPUBScHfO1AZWv44tBKOkkOW1c0NGxfILuy+ZiSCcadRPbHTbsuOwQqsspfVOT9Yw3KrsCVGdCZJ0qM7bnck1XeHQFGhtTGjGX6yYOPdB6b7FSqAn5uRW9GkN1KJoydMOESF8BXKg8tUYnGDjJU70BfFOar3FfFSQ3CwhC/Zyu5UnoAPtH1HxHyqvcPvZrRJbiYtzZmISJsgFgfNIw7AdB+HQithrRVR7qBG9pdNYiYgtEGJ1SgdWz2z6/cIBveNuNyxctINQ1HOsDOSD7g+ORuPu7mpU8SkEKhlj9taMsItXUj/wAzj4EZ2zVY4RP7BBzLjUzykMkJ6jH/AOQ5zpb/ALZ36eJuHhpfbZJ29mOHVhtITnaMDsQRjI7feRIM3gg3bzvISeWSeaXzu3oB2YbD0A29BV8qC8MeIVuw406HU509fKTsc+vY/H51O1AFKUoBSlKAUpSgFKUoCF49Y2rNG8+gPqwhbYMcEhW9V77/AOuDVTLcCc214jSrM3Qdj+nEewA7enXG9WfxP4dF2AQ5WRQQud1OexHb5j99Qi3zWMUcFyXdn1bqd4k90aGxue+M7D7syDw9yOGqqxgyxyMeZLnY4JGhMHCuO/y/w69rZpBrkaQNw6Ze+7OTnCgdeYpB37Y/D5bWIt0dy6zcPZeg+2xOFXHVHBxlu2PuGaLXM+2JbCUYI2UQBR37Iydc9G/gB6YFpDZ6B7JMgMJjGcY3EhPU77Nn4dB11n0W4RZMTXluCVCkhVXIIBPVymS2BjYn0rI14gRbONmEEi+Sck+ZmPp9lC2VK9R3qG45xiCxWL2zMl7GMLDGwyU+xzm3CgbjuSpGxwa6jFydkQ2krsmlup7lwq6jbzxEaUGFjfvnHpIo3P2W+NRs13bWwtzdXcMU1uxyinmvp1BlUqmSDnWPTBrnXFPF15essAcQwswRYYvIg1HA1Y3bqM5yO+KmPEvBuF8Nja3bm3XEMLqIJRIwSCcY2GVyB75Ge1alhbNKT1fJFHGvdx2JO68ZcLVZEUXsiu4fKrGoGNWANRz0Yjp6Vjbx9w88zVb3uJMavNHtgg7feKw8ctOHtxHhrQ25jt7rlyvv5WLvgJp3C6WGGAwMNVI4upt7yYIdJhncKR2KSHB+7Aq6FClLkziVWcTpVt4w4YzvmS6t3MXJ+uiDacIEziMk5wMfeamuH2sc/s6208M8URZ5DE415LZPkzqGVVVHfNVji9reyWF03E5IzIqpNHFhBKpZggd9KjQuNgM5O+emK5rbBi66CQ+oBSDggk4GD2+dcLDQmnZ2+a+xLrSi1dHdU43OqHnoZHmdlWJwQQh98A+8Mkqo/un0rJDwqG40rC59mhLGWPcuScnKke/qChQeoA9aqPEePXvC5UtuJBbyMoGWQE8xQwKtolIBJBzs2523GasFhyriGN7OfFnGS8z5xKjj9JeoYLhVxt1Pess6Uoq/LqXxmnpzJG3v0mDT3qKIFkAh2OoEH3NveQAZYHvn5Vhw1vI15cuHkYnkhG2kyPeyOkYBG3/bOdLmO+KvMmllZhChfCzdToOehzpBYbHOPlhS90ZPEPMJGBWArumDjXjPkQAY0/a/Emo7Nj2RLtVupkfmhCTCD+eCYwyAnIXfcD7vU4eD3E1yZJJ9K2OnS4OyKB7oj/aBxuP44pJbNbze1Xk2XB+qVD5pAOmB9iPBxj5/fnurKXiSwvE2iHcOh6RsOpAGNec7f6dgLXwS0hjhUQAcsgEN3bPcnua360uD8NW3iESFiBk5Y53PX4D5Ct2oApSlAKUpQClKUApSlAfG6bdaoiG65vJvY1lgkJYsfdQbkuj/AGQBnY79tqm/FvELYIYJ2dTIAQQpOnfZvQ7joN6hoLee1tjysXUbsDjBKiLH6HUFiT0yNqA+Dmko1gyS2wURmE9gTvzFPXJyS/8Ap117+RArR2IRo1YmaLBJk7ZHd4x0GncdfQ1lgESRc23xb3E6kIsj7AK3m0MRtqOANWPhioTxJxf2GD2mSFY+IMWSEdATgapymMeUHqNmYjbvXcYuTsiG0ldkb4p8Rrw5TBbnN42GOrDey5XoOxmIPXpgDI6VzrhvDp7yblxAyzvqbBYZYgFmOWO56nc71lfg1yzwh43El0cxmQ4MhZsassc+YkbnrnPxqw+CvCr5a8upZLO0tydUmWSRmGxRMeYHPlJG+fKATnHqQjCjDR6/cwycqktdjd+jzwbFdrcpOky3KOqAqQptzpY63UsCfMunGCfluRP+IeK2kEAg4pLHxS6VgCEXQ0Q+0OYvcehKk9/Wo7i/EY1vV4jcpc20EvuW655lwYTgNMCwCDOjY6tQHfOahOD+CL7ikslwIxDFNI0nMkyAdbFjoGNTdeuAD61X7zzTdl9+if4LPdWWK1NHxV4miuGtxa24torbVy11Z3Zw2Ttt5hnqep3qDmv3adpyRzWkMpOBjWW1ZwcjGexrs3DPoXtVA5880rd9OlF/DDN/1VJP9EfDSMBZgfUSn/XIqViaMdEQ6NSWrKDa/Si8waLiUKz2rppZYhoYnUDqPm3Ow6FakPDfh3hF1dQy2d08bJIrm1nG5K7hVJIJ3Azgv3rd4x9Cq4JtLlgf0ZgCD/7kAx/hNc08Q+G7qxfTcxMmT5XG6N/dYbZ746j0FI8OelOVv3oQ3OPvq5dPE3gy5uJp2e8eW8RGl5MsTplAd+S2t0KgkAAHAJAOM1QuC8XmtZRNA+lxse4Ze6sOjKfT+BwauHB/F/FZLKWGEtOVwpYIXmjRgehGSynBGoglfXdcQcnhOSPh7Xk2uIiURJE0ZBbYHXkkYHvDp1HWrINpOM7dDmerzROg8J4hHex+026Fpk0I1t1EJ7Oo+1GTuoxjJOrOCKsEEgbqI5uJRJt3BwfweVB6ficVw/w7xuSynSeL3l2ZT0dT7yN8D+44Paux2reSOXh6qkEqiTnuR5RneNmOyBT5SoyTjqaw4mhw3dbM00amdeJIQQA6Y751muSxeOLVuCVzodxsAxC4Xpn16Vs+G7i9lmEjKI7bBUIRpAHbQvUkYG57Z+VaF80MbrPbw8+WdmKncojg+bSuNROrcZ+Yr1xzh+sx3F5KY00rmLdm1geZVAOFBADZ+O9Zi4vtK0uEcSjuI9cWdI23UjBHb4/dtW7UAUpSgFKUoBSlKAUJqI8QceW0CFlZtZI2IyMd9/mK0ZfEUFzbT+Z4lwEZmTONeQMBSc0Bo8XupZblYLi0RoS4VG82wJ94SD4bkY7VHAQ3NyDbXEsMmyqpXbSgx5GXoNIJw3WsvArMx8xob2N0WNsDUyAOwwhZW2AyfxxWaztblFlklgjdhGQjxqupmY46x4J2J7ZqQYeJK93cAPBrhdtMc0be6uepYalIxltLDO56Vyzj3GoLniKmVXewiIiREPmaJNhpwRu7ebqDvjNXa6m9ltL2cJLFIsQiUMftStpDDKg5Xc75rjgrfg6d05fwZcRO1kXrgtpLxbiBZ3khtbfzHLY9niQ+WNTtpby4zt7pbcitD6QvF78QnYB2NmjHlIRjbGNZ7knfGdwDjrnPi+8dXMto1qVhUSHMsiJpkm/vkHBJ7nGW7986fhng7Ti5m20WlvJOcgEFlUmNSDsQWGSCMEKR3rRbL7cuW374lV83sx5nTfAHgd7lhxDimZZXAMccm/lA8ryDvt0XoBudzgdWrh3C/pHvZlyJ8OPeXRHt8R5elbv5bX36/wDy4/5a8eriM0tSqXaNGjJwkmmvD1OyUrjf5bX36/8Ay4/5afltffr/APLj/lqviojvjD+Pl6nZK1uIWMc8bRTIskbDBVhkH/v3B7VyT8tr79f/AJcf8tPy2vv1/wDlx/y04qHfGH8fL1IXxd4eueB3HPs5XWCTKq4wSudzE+QQemQSN8eozWPwl4yMrvacTdp7S6IDNIxzE32XU/ZGQvoFOGGMHM+nGri/ZbW5l1wTMqMNEfcjcELkEHBB9RXLuK8Pe3mkgkHnjYq3xweo+BGCPga9XDVI14tPdc+ZNPERqLPT2udB4jw1OG3jRyWtqllNiL6ydZG0s210Fc6xp3JAUAEHfoa2vD3EIZbq8sdKcjW01ssDDSWjXDLGdwBIo16RkLv161VLnx7cyWqW7x276U5fNeMPJp7DLZXpgZxnbPXeoPgPEja3MM4z9U6scd1B8w+9cj76tdGUotS3/dS/ipNZdjunB2maOSBVForrmLchiwOT1OtsqDlgMDG2K1uFm10yQ6nuWIMoBBRWdFJwPt5IzueuK8yQGK+LRQzSkSBtQyRhsHoFycK2N2qSS1uIbjKrbwWyydfIpZNXcnL50/KvKNpIeEeITSAq1ukMCjyEAr1PQA+93JIxVlrnU9mkVwHuL5S0cmoLh5GGDkA+hxVk4v4uht3MZSRnGOgGNxkbk+h9KgFhpWpwu9E8SSgYDjOPT4Vt0ApSlAKrHjC9u42i9mEhGG1aY9Q7Yzscd60vGHD7uS4DW4k0csDKvp3y3xHwrHf2HEDDbiMza1RhJiUA51bZy2+3zoDFxfic/JtzLbxyuVctzISdPmwPTScAfOsP9IRCyZpLVAGnCFFZkBwmrV3I9MVv3lnxLlwcsyawp5n1i9dW2cnfasqw8SFtjJ9o5vcx/m9H4e999SCGtbizNtMeVNGjNGjBXDHuwwWHw3zX1Y7UWhMcs6I8wBZkBYFUJxhSNtwc1KcviHIbWY+brXGrlY06Wz2x1x8a1bwTi1Xmeya+cfe5OnGgevl1Zz03xQFS+kifTwuFVnaZZLnOpgw8qxkacMTtqwfSuV1036Uw3sFoSIs82XaLTp6D9HbPWprw94S4DduY7dppnVctvKAB8W0qoPwzvXo0Kip0k2upjqwc52OMV1rwXw8J4d4jL9qaK4Of2UiKgf4g5++tf6TPD3DbGBkhtpo7livLkJlZCNQ1DUzFM6dW3Wpvw8R+S02P7NdfxlpiKuejddSaUMtSz6HDredkYMpww/8AMfKujeHuF3V5AJobdmQkjIZAMqcHGpgf3VzWv0N9B3/2tf8Aiy//ACry5RTJxWCpYi2fdcyq/khf/wBlf/HF/PT8kL/+yv8A44v567VSueEjJ3Ph+r8/Q4r+SF//AGV/8cX89PyQv/7K/wDji/nrtVKcJDufD9X5+hyHgvhy7huIJJbd0jWWPLFozjLgDYOT1I7VBfTjw4R36ygYE0QJ+LKSp/6eXXbeMfm1/wCLD/8A2SuV/TrFruLFO7Bx/ieMD/WteCWWpoXxwkKFJxh1ucjr4a6pxD6M4H4k1pBLJFGtssxZhr8xkZdPVdsDPWqxP4WhXg8XEOZJzZJCgTy6MB2XPTOcLnrXqKvB2/j5nDpSR0RplltLJ5buSPXax5QK7BiBhm2IXf8A0rPx5bPVG8rXLM8KN5AgBGnAJ1ZIJx0rR4Xr/o+wwLY/Un88Y8+8enMPTGKnb9LorByfZvzKZ/M9d86c7afTG1ePPST+JvjsiO8QXlqJmZrdpGdUbJlKg6kB6KK2OOcQAaJltIpGkhjfLqz4yOnXtjrW/wAQj4kWHJZdOhM45XvaRq6jPXPw9K9cWt+JHlcot+ZTmYZB9Zvq7/LptXJ0as3FbxbaAwRaGJkDLHDsuGGnC4OMgn51ZvDU0r26GcMJctq1LpPvHG2B2x2qu3dlxE28IUyc0M+vEig4JGnJ1b96x33D7820CjnGUM+vEm+CfLk6t9vjtQF6pVf8F2s0cLicMHMhI1HJxpXvk981YKgCqx4v4ddStH7MWCgNqxJpHUYzuM96s9KAoHG+GSrFbiW4jjZVYNqkbzebIxgHVgEVg9khNkytdalWcMXWNzglMacHGfXPSrjx3gMd3o5jONGcacb5x6g+grSueBQW9tNojMgxrKsx8xTcdPv6VIKrax2nssw1TsiPGzYVFOTqUYyTtvvn4VkiWJ7MiKCd1WcHSW3JZMZ8q9NgMD8a3+Cz3DcwJaRwqY20sItOXG6ZLbMM5rFaXUsizRy3au7xkqsRyQV8xxpCp0BGA29AVj6RrFzwlGMJh5VznSdWdLIRnzb7sQK1L76TVhgjteFwLGdKgyaB75AzoT7TE/abqex61O2fD/arW8t40kbmxalduhkjOpBsDgk/tHpWh9D8KpY3VzBCs3EEYqqkgHToUqoJ6AktnpnGOwrZSlHhe0r2f16mealn05mK3j4zc8MuYrqAvCY9aPKdMuUIfAXBZs6cAMFO/U9Kx+BuKB+A8TgJ80MUzAfsSREj/qEn7qln4BxviGTe3K2Vv3jjO+PiFO4x+lIcelUDiEJ4Zd3Fusmq2uIWi5h3DQzJ5ZRp97Sd8jrpYDrXbSnCUVa++hzfLJN7bFUs7VpG0r959BVwsJpIUEcUsyIOyyMBk9TgEDJq4cP+imVY15dxAyMAQw1HVke9nvkVs/1XXH6+H8G/2rw6yqzei0PsuzZ9nYaF6k05vfRu3gtP9Kd/Slx/aLj/AJsn81P6UuP7Rcf82T+arj/Vdcfr4fwb/an9V1x+vh/Bv9qp4VU9PvHs3qv6v8FO/pS4/tFx/wA2T+an9KXH9ouP+bJ/NVx/quuP18P4N/tT+q64/Xw/g3+1OFVHePZvVf1f4IDwzfzNeWyvNMymVMhpHIPmB3BOOuKy/SNcS3XG4orZObJbiMBOxYHmNk9AMFQT8K3uJ+Gn4Uq3k00LCJwVQagZH7INu/f0AJ7VC/RnxRra89tvFZYLoSJ7SwwgkLhjluigsCPn8Acet2fTnCEpyXwPle3sRh61aCoPS2tlbm/Au3HfHF/ZSQxz2VvJLPkIkM7EnBAwQY+5Ix99ULx54+9ut1tvZDbNHLrYa840qwKkaFIOW/dVqb6PeIJxCO7hu45kEmsPKzFlRicrghlI0lgMEeo09ojxxw+K94/FBCFOrlrPjuV1M+fiIgq/MY7VtpKkpJpcr31+h4tTO18izXfDmjt7OM2ryiO2jDMpfZseYeXI+O4708QG2DRJKk6lIY1Ghl6YzjzLuRnrtX2+HNvyPr4pHkCjA95V2z9kqNIz3qRivp5bnEVzC8DSbxkjITO/ldQT5c+6TWBu7uaERfiC3tTOVaWWNkVF3jDDZBjowPz261sces01QqLpEaOCNMMHXOAfNkAgZz07VkubiR59M9jGVkk0hzGynDNgZcbHbFWTivhW3nYu2tXIAyregwNjkdKgkgW4PdPawCCYOQZCzJK2GyRjB2zjBG/SrL4Zt5Y7dVnLGXLZ1NqPvHG+T2xW3wyxWCJYlJKqMAnqd81tVAFKUoBSlKAUpSgKPxmzW3uVuLi6YnVrRFTLED7I3wq42ztn51hjXlXAFnaB/dbmsScowz5ScKmxIqweKbKHQZmtzNKuAoGrf+9p6qNzvUI8M91a5nPs0aEnAUhTFp/Vg5OkgYztg1INTi7i2uVleaSQg64Y06aSTgaj5QOq4UE49M1RPGPtPCb43Fm8kEd2vMXYd93jZWBGVY5GRsGAHeuiWEomiMVkrCSEfVyyAEkM3nGcYjPQjvgdqirjh8V9A1gZHklOqVJ8ErHIB2z5ih8wLHrnYbg1dQqKEtdnuV1IuS03ILwTYXfF5DccRmllsYTnQdllcb6RGgCkDvtvsu++Jn6QfDrXMUt5fzLaxwoRbxAAlckfnWHvO5AGhNl2wTvmH8HeIL1ZI+DyPHaFHZWkIHM09eWm2jW2Thz1BBGTjVZfGHi3htmyDHtU8H5uENlI27u7HI5n7R1OPQamJ0SzqorL4W6fTUrjlyalQ+jr6QXsD7Lehxbj3SQdUORnBXqUIIOOoztkHA7haXSSoskbq8bDKspBBHqCK5Lw3wnccac3nESLeN10wJGoVmG5DHUCSo3Izu3UaVxmmcEk4ha3NxFw2SaTks+oRrlXCtp1mM6gSdsYy2OlKlKFVtp2lz6ERnKG+q5dT9J0rilh9NU6eW4tYnYbEo5jP3qQ2/3ipJvptjxtZvn/AIox+On/AEqh4WquRZxodTrNRPiPxHb2MXMuJAo+yo3Zz6KvUn9w7kCuTXf0p8SugRZW2gd2jRpmH340j71qP8H+GxxAXF9xO4l5EBIckksSo1MCSCVVQR5QM74GMb9rDZdaj/JDq30ianiC+v8Ajbyzxwube3GRGu4QH/5yEbnG+B8s7fg36STBELW8iW4ssaR5V1KvoR7si/A7/E9KtVnbJYQHiPB5Wnsetxbux3UdXXIDJIo3IYdPgAD6uPCfC+IsvEo5hHa7tcx7KCQMkNv9W36WPeG4wTqN7nC2Vr2eXVP8leWSd09SD8WcHgisze8K4hJHakgGBZXA1MfdUA5VupKMOmTkAV5+jPhvs9tNfyI55uYYtOxCk/WSZwQNxpBI6qR3qHsuBRcV4lItlG0FiCGc/or0yB9lnOdKb4ydsAgdDWXnOiWTtA8K8tIG2BRfTbGcAFkYdu+K4rzyQyX1fnbxOqcc0s3Q2fD0ciRPJbyGZQNMUTjBD7Z2J07KT7p3yaw2Twqsks1u1s6/VZTPvSKQSEb3Sq5Ox6GvfFTbyyC1OuCSJtMbBMIzNjJKDdct0I7b5rPxWWeLlQyQG6gCgFiCxZ99RVhupHQZ32rCaCQ8F8L5YMkdzzYG2ChSNx3wTlSNxjH+lWmtPhdhFCmmFNCnfG+enfO+fnW5UAUpSgFKUoBSlKAUpSgPMgJBAODjY+nxqgC3e3l9ovpiXGQsakM0g3GMe6qH0/ganPF/H5bfSkSHXINnIyPTAHdunX1HWtBeHiVI2vFD3iqxWIMA0qjcB/iDnp/uKA17jWwjkjlW34eoV1K7YYHdSvV5NQPqO+/fDxFFuImlt8xW2pjOoXzEg5Dbe8CCPLkBTufUeYr9pEaS8wtow0rEBgkqduUNsae7dO3yzEGFxdPIBaoMW6RnAkDDZMHp+2TvkfDaQQPiHhMfEokaQrBdjy28rEnmqPsyHGfe2En6ROB1BpXhe3tbG9ZeLQyq0QykekMpbfBYA+ZTjykZUnrtXVVtxIFu0TFyY8xwEjHlwOYinfSBuEx16fGM4hFFMkdrfoZ3wWZ84ktwRkAN1JABZlO3Qb4xWmliHFZJbfNFU6d3mW5MReIYJrefi0UkpEUDIsUgwI3GGIG2CzHlgtlhsAD2qo/R8fYOD3fEG/Oy5EZPfSdCfjKzZ+AqKv8AwRepA68PuDdWUu7RA6X8rA7xtsSCF8ynJ9MVD+I/FUz2UHD5Lf2fkFc51KX0qQNSMMjcljvufSr4U1JWg7pteSKpTa1ktbfM6V9H3iRbjh0rT28YisogoydWsRx5OdQ2OAPXrXJfGnGILucS21utsnLClFCjLZYlvKACSCBnrtVi8MeJba34PeWzSEXU5fSuhtwyKnvAaRsGO5qg1dRpJTk7FVSd4pH6Ut767uLawmsuQqSaGnVx0QgaguOjA6hjHWoO68R2ScSu7GUoLe6ReY2cKJipR1Y9BqjEW/Zh6mqHw3xlCnBZLGQzCfU3KMfYFg4LNkYGrUCBk47VUeEcFuLo6baCSU9PIuw+be6v3kVTDDL2s2i/dS2Vba2p2ThHBU4HbXrXF0ksEw+qjxgsQrDGM4LsCoONsLnp05V4U8P3N5rSNzHbDSZ5GJEahdxqGQHYZyq9cnt1q18I+jaOEq3EJQXbOi2hO7EfZaTouT5cL36NVwtLl5Eh9jiURJmN7VQNOGzufVWGQWbowJ71xKuqd8ru3z5HSpuVrqyRpJBDDDHaW6stq+CsoyXll7tIBud8AoBlcKRtgGYldYRybl9F5LGQZwvuqTsrN9rOCC/Ueu2a+GSKw06NUsMrtmQMDy8ArhOo5gBOWPUD8MK2iwIfa2EtoWDQkbsxYgkrvkLjdgevbfrjbbd2XpWNmO6a3Vfb8O4YrC64ZwuneQN3UZXGd89tqy+GOGTxzKYZxJZtliQev7JU7q+cZI9N/StSOWZ5hDMi3FtOcoV2VV6aoz9jSOq/75OS/eS0ijaxZWtkJLuMMWfODzMfZxgAj921QSXulRvh/iZuYRIUKE5GOxx3Hw+f/epKoApSlAKUpQClKUApSlAVzjHie3SRYsgsCQZAAREcEat+pGdwOgz8qrT2RtpDcXjl5Q2Y0Vt5COjkj3U6fwx2Ng4zw6FZnnjRZLpV18nIwTn84V6kj07/AD3qL4KjXcTyX2DbqdSyHYg58yrj7BGxHr036SDPa2S8QEdzOrIVOkqD5ZcZwEyfLvsfXffuNOLiDu00tyuizQcswEbEj3Y1HZx1LDp8un3jsMtxOijEdmi6kdT5FRer5G2odAO37znilTibmIrIqxbpIDnK7A6wdtTYyD1/A5A8GLJfiAzKoXMMekgoRtuBtoT1Gx67d8CSiYRRXAJuZx+cjADKhIKBx0bONR6ELj1rYubSZbppWRo7e1QsgQ4BRRsoPq2PN8Nj2rFa8QQxNdTqI5pCYkkjBJOV3fQT9kbagfhQHyPhja+bbskscEZWMRnLB8Y8y9cl2eT44ryl3IRa286JM0rEulwmshC2kbHfortv619n4JIIYYIGViz812VtLAHZG0khgAuT8DUgeLSi5uc/mbeNiquo95QFByRq3Oo5zvQFVuuHcMkjklbh0eFkCLy5XjBBDHOF2GAo/HtWCfw9wtDL/wChc8vH/wCzLvk4+799Tr3sfssJe1hPOkbypqQeXC6hg9d8VkurmDN4fZlJjYA/WP5/rdOTvtvvtViqzX/T8znJHoaVtw+xikdIeH2+Vh5qNJmUk8sPjz79Cw69q3oeIXEy2zxhmjyySxxDC7HfIGwyjDrsCK2Y+Ios1mRBCFmjQFiCWXOU0qSdgNh06VjhkuLmG7gJYvGw0aRpB0sQybYHQdPjXDk3uyUktjBDwFVDQTyjVGzSRrGQZCoHm26DUAjDfO3TrX0cYIEb28Q5DuyTRAZd2OfePU6lOVxtkEdqyzW/LW3uZZQkkGI5AmHJK+6vlOASmQSTX03aQzJHBHot7sDzqTrJfIGDnC6CfdH+tQSBbxWJZJ2MlvM4KJpyF0kedie6+6VHUdfSlpzXmktboGaKQaxIMYQY8sqnoq42x92+4Prg3AJnSW2nUiJWzHJ6PnqoPVWG5+/v0xTXiuH4eA8IXyxszbs4J8r9tLZ2xt09QAB6u7gcPVbfS8kMoJkkyRqDDB5eDhcDGfX781i4TZm1c3CTg2OnJbbL9hGU/TycZ7fDpWxwSMtbmC+GiHVoiLnDB84wvwHr07bjpj4hPcQXKwCFWt2GhIQPK6dzk/b7knp323IFm8O8chuEAjARlG8e3lHw9V+I/dUxUL4d4Xbw8zkEM2ohjkErj7H3fj61NVAFKUoBSlKAUpSgFeJVJUgHSSDg4zg+uO9e6UBQ+CeGbj2syTMw5bajIDvIfgfQjr8NvlPeLODPcQhYm0lTnR0V/gfQjt2/iJ6lAQ/DOARx2vs7+dW3frux329MHGPlnrWxwThEdqmiPJySSx6n0z8hgVIUoDzIgYEMAVIwQdwQexFRnGOAxXJj5mdMecKNsg42Pw2HSpWlAVS44M8d1NeNhkjUmNQMkkR4xgdANwKhLXisyWMjtIzM0ojXX5sYGptmzsRkV0aqj454sYjHGscUmoElZF1DsFxuN/eoDQuL7DWMbQwNrVGOUxp5j9VwQB6/OsY4ire3HkQeXf3W8/1v2vNv67Y3qQvLuL+kIoDbxsU0BXyQVwNQwBtgdhWlwy+gdbsi1UaULN52OvzZwfTffapBhvuMOtrayxpCjZkU4jHl0tsF1Z07ZqSN7IOJhSztBIowu5UKydcdPeHWtL+lF9g5iW8ACTaQjKWUZXOrc9ckVbvD95zreKQ4yV3wMDI2OB2GQaAhODeE+WLiKU6oJNOnBwdiTn4MNvgan+H8MSKJIgNSpuNQB3znPzz3rdpUAVEcS8OwTzJLICSowR2f01euN/n32qXpQFZ8YeHGutDxkcxfKQx2Kk9fgR1+I+6peDh5EAiaRywTTzOjbjqPT+O3U9a36UBRfDXh25guj5tMS9WHSQdgB/5ir1SlAKUpQClKUApSlAKUpQClKUApSlAKUpQCoziPAYJ3WSRSZFxghj0ByBjp1J7VJ0oClW8ltJxIsOfz1ZuujR5FKn9roPxrW8PJaNHdcs3ODCdesJnTv7uO/wA9qn08OQwSPchpdWHYjKkeYEnG3Xr3qH8IW1q/OSFrjzx6W5mjYHbIx3+dSDL4XtLW4glhQTcvWrNzCuc9saeg8tWnh9ikCCOMaUGcDJPU5O5JPWtLgXAI7TXy2c68Z1EHpnHQD1NS1QBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoBSlKAUpSgFKUoDDewcyN0zjWpXOM4yMZx3qD8NeGPZHZ+br1Lpxo043zn3jVipQClKUApSlAKUpQClKUApSlAKUpQClKUB//9k=";

const DB_KEY = "moi_attendance_db_v8";

// ===== قواعد الدوام =====
// الحضور 7:30 أو قبله → الانصراف 12:45
// الحضور بين 7:31 و 8:00 → الانصراف 1:15 ظهراً
// الحضور 8:01 أو بعده → يُحسب تأخير من 7:30 حتى وقت الحضور
// بصمة التواجد: من 9:31 حتى 10:30 (تنبيه صوتي)
// حد التأخير الشهري: 95 دقيقة
// الاستئذانات: 4 في الشهر
// الإجازة المرضية: 15 يوم في السنة
// الإجازة الطارئة: 4 أيام في الشهر

const LIMITS = {
  lateMinutesPerMonth: 95,
  permissionsPerMonth: 4,
  sickLeavesPerYear: 15,
  emergencyLeavesPerMonth: 4,
};

const SCHEDULE = {
  workStart: "07:30",
  graceEnd: "08:00",      // نهاية فترة السماح (7:30-8:00)
  lateStart: "08:01",     // بداية التأخير المحسوب
  earlyCheckout: "12:45", // انصراف من حضر 7:30 أو قبله
  lateCheckout: "13:15",  // انصراف من حضر بين 7:31 و 8:00
  presenceStart: "09:31", // بداية بصمة التواجد
  presenceEnd: "10:30",   // نهاية بصمة التواجد
};

function timeToMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2,"0")}:${String(min).padStart(2,"0")}`;
}

// احتساب دقائق التأخير — فقط ما بعد 8:00
function calcLateMinutes(checkIn) {
  if (!checkIn) return 0;
  const ci = timeToMinutes(checkIn);
  const grace = timeToMinutes(SCHEDULE.graceEnd); // 8:00
  const workStart = timeToMinutes(SCHEDULE.workStart); // 7:30
  if (ci <= grace) return 0; // لا تأخير حتى 8:00
  return ci - workStart; // يُحسب من 7:30
}

// تحديد وقت الانصراف المقرر
function getExpectedCheckout(checkIn) {
  if (!checkIn) return null;
  const ci = timeToMinutes(checkIn);
  // ≤ 7:29 → 12:45
  if (ci <= timeToMinutes("07:29")) return SCHEDULE.earlyCheckout;
  // 7:30 – 8:00 → 13:15
  if (ci <= timeToMinutes("08:00")) return SCHEDULE.lateCheckout;
  return null; // متأخر > 8:00
}

// تحديد حالة الحضور
function getAttendanceStatus(checkIn) {
  if (!checkIn) return "absent";
  const ci = timeToMinutes(checkIn);
  const ge = timeToMinutes(SCHEDULE.graceEnd);
  if (ci <= ge) return "present";
  return "late";
}

// هل وقت الحضور داخل نافذة التواجد؟
function isInPresenceWindow(checkIn) {
  if (!checkIn) return false;
  const ci = timeToMinutes(checkIn);
  return ci >= timeToMinutes(SCHEDULE.presenceStart) && ci <= timeToMinutes(SCHEDULE.presenceEnd);
}

const initialDB = {
  users: [
    { id:1, username:"col.abdulsalam", password:"admin123",   role:"admin",    name:"العقيد عبدالسلام العتيبي",  rank:"عقيد",      employeeId:null },
    { id:2, username:"lt.mohammad",    password:"admin123",   role:"admin",    name:"ملازم أول محمد الفيلكاوي", rank:"ملازم أول", employeeId:null },
    { id:3, username:"loulwa",         password:"emp123",     role:"employee", name:"لولوة صلاح",                rank:"",          employeeId:1 },
    { id:4, username:"rafida",         password:"emp123",     role:"employee", name:"رفيدة العنجري",             rank:"",          employeeId:2 },
    { id:5, username:"mouniya",        password:"emp123",     role:"employee", name:"منية عبدالله",              rank:"",          employeeId:3 },
    { id:6, username:"anfal",          password:"emp123",     role:"employee", name:"أنفال السويلم",             rank:"",          employeeId:4 },
    { id:7, username:"afwaj",          password:"emp123",     role:"employee", name:"أفواج الجيماز",              rank:"",          employeeId:5 },
  ],
  employees: [
    { id:1, name:"لولوة صلاح",    employeeNo:"GJM-001", title:"موظفة", phone:"", email:"", status:"active", unit:"أفواج الجيماز" },
    { id:2, name:"رفيدة العنجري", employeeNo:"GJM-002", title:"موظفة", phone:"", email:"", status:"active", unit:"أفواج الجيماز" },
    { id:3, name:"منية عبدالله",  employeeNo:"GJM-003", title:"موظفة", phone:"", email:"", status:"active", unit:"أفواج الجيماز" },
    { id:4, name:"أنفال السويلم", employeeNo:"GJM-004", title:"موظفة", phone:"", email:"", status:"active", unit:"أفواج الجيماز" },
    { id:5, name:"أفواج الجيماز",  employeeNo:"GJM-005", title:"موظفة", phone:"", email:"", status:"active", unit:"أفواج الجيماز" },
  ],
  attendance: [
    { id:1, employeeId:1, date:"2025-01-13", checkIn:"07:25", checkOut:"12:45", status:"present", presenceStamp:"10:00", notes:"" },
    { id:2, employeeId:2, date:"2025-01-13", checkIn:"07:50", checkOut:"13:15", status:"present", presenceStamp:"09:45", notes:"" },
    { id:3, employeeId:3, date:"2025-01-13", checkIn:"08:15", checkOut:"",      status:"late",    presenceStamp:"10:15", notes:"" },
    { id:4, employeeId:4, date:"2025-01-13", checkIn:"07:30", checkOut:"12:45", status:"present", presenceStamp:"09:35", notes:"" },
  ],
  lateRecords: [
    { id:1, employeeId:3, date:"2025-01-13", checkIn:"08:15", duration:45, reason:"ازدحام مروري", approved:false, approvedBy:"" },
    { id:2, employeeId:2, date:"2025-01-10", checkIn:"08:20", duration:50, reason:"ظروف عائلية",  approved:true,  approvedBy:"العقيد عبدالسلام العتيبي" },
  ],
  permissions: [
    { id:1, employeeId:1, date:"2025-01-13", exitTime:"11:00", returnTime:"12:30", reason:"مراجعة طبية", status:"approved", notes:"" },
    { id:2, employeeId:3, date:"2025-01-14", exitTime:"10:00", returnTime:"11:00", reason:"عمل رسمي",    status:"pending",  notes:"" },
    { id:3, employeeId:2, date:"2025-01-12", exitTime:"13:00", returnTime:"14:00", reason:"ظروف شخصية", status:"rejected", notes:"" },
    { id:4, employeeId:4, date:"2025-01-08", exitTime:"09:00", returnTime:"10:00", reason:"أمر عائلي",  status:"approved", notes:"" },
  ],
  leaves: [
    { id:1, employeeId:3, date:"2025-01-13", type:"excused",   reason:"مرض",            attachment:false },
    { id:2, employeeId:1, date:"2025-01-10", type:"unexcused", reason:"",               attachment:false },
    { id:3, employeeId:4, date:"2025-01-05", type:"sick",      reason:"وعكة صحية",      attachment:false },
    { id:4, employeeId:2, date:"2025-01-03", type:"emergency", reason:"ظرف عائلي طارئ", attachment:false },
  ],
};

function loadDB() {
  try {
    const r = localStorage.getItem(DB_KEY);
    if (!r) return initialDB;
    const parsed = JSON.parse(r);
    if (!parsed.users || parsed.users[0]?.username !== initialDB.users[0]?.username) {
      localStorage.removeItem(DB_KEY);
      return initialDB;
    }
    return parsed;
  } catch { return initialDB; }
}
function saveDB(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    fbWrite(db); // حفظ في Firebase
  } catch(e) {}
}
function useFirebaseSync(setDB) {
  useEffect(() => {
    // جلب البيانات من Firebase عند التحميل
    fbRead().then(data => {
      if (data && data.users && data.users[0]?.username === initialDB.users[0]?.username) {
        setDB(data);
        localStorage.setItem(DB_KEY, JSON.stringify(data));
      }
    });
    // مزامنة كل 10 ثوانٍ
    const interval = setInterval(() => {
      fbRead().then(data => {
        if (data && data.users && data.users[0]?.username === initialDB.users[0]?.username) {
          setDB(data);
          localStorage.setItem(DB_KEY, JSON.stringify(data));
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);
}

function calcStats(empId, db, year, month) {
  const ym = `${year}-${String(month).padStart(2,"0")}`;
  const lateMin = db.lateRecords.filter(l=>l.employeeId===empId&&l.date.startsWith(ym)).reduce((s,l)=>s+l.duration,0);
  const permMonth = db.permissions.filter(p=>p.employeeId===empId&&p.date.startsWith(ym)&&p.status==="approved").length;
  const sickYear  = db.leaves.filter(l=>l.employeeId===empId&&l.date.startsWith(`${year}`)&&l.type==="sick").length;
  const emergMonth= db.leaves.filter(l=>l.employeeId===empId&&l.date.startsWith(ym)&&l.type==="emergency").length;
  return {
    lateMin, lateRemain:Math.max(0,LIMITS.lateMinutesPerMonth-lateMin), lateOver:lateMin>LIMITS.lateMinutesPerMonth,
    permMonth, permRemain:Math.max(0,LIMITS.permissionsPerMonth-permMonth), permOver:permMonth>=LIMITS.permissionsPerMonth,
    sickYear,  sickRemain:Math.max(0,LIMITS.sickLeavesPerYear-sickYear),   sickOver:sickYear>=LIMITS.sickLeavesPerYear,
    emergMonth,emergRemain:Math.max(0,LIMITS.emergencyLeavesPerMonth-emergMonth),emergOver:emergMonth>=LIMITS.emergencyLeavesPerMonth,
  };
}

// ===== UI Primitives =====
const statusMap   ={present:{label:"حاضرة",color:"#1a6b3a",bg:"#d4edda"},late:{label:"متأخرة",color:"#856404",bg:"#fff3cd"},absent:{label:"غائبة",color:"#721c24",bg:"#f8d7da"},leave:{label:"إجازة",color:"#004085",bg:"#cce5ff"},permission:{label:"استئذان",color:"#5a3878",bg:"#e8d8f5"}};
const permSMap    ={pending:{label:"بانتظار",color:"#856404",bg:"#fff3cd"},approved:{label:"موافق",color:"#1a6b3a",bg:"#d4edda"},rejected:{label:"مرفوض",color:"#721c24",bg:"#f8d7da"}};
const empSMap     ={active:{label:"نشطة",color:"#1a6b3a",bg:"#d4edda"},leave:{label:"في إجازة",color:"#004085",bg:"#cce5ff"},transferred:{label:"منقولة",color:"#856404",bg:"#fff3cd"},suspended:{label:"موقوفة",color:"#721c24",bg:"#f8d7da"}};
const leaveMap    ={annual:"إجازة سنوية",sick:"إجازة مرضية",excused:"غياب بعذر",unexcused:"غياب بدون عذر",emergency:"إجازة طارئة"};

function Badge({status,map}){const s=map[status]||{label:status,color:"#555",bg:"#eee"};return <span style={{background:s.bg,color:s.color,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{s.label}</span>;}

function LimitBar({label,used,max,color}){
  const pct=Math.min(100,Math.round(used/max*100));
  const over=used>max; const warn=used/max>0.75&&!over;
  const bc=over?"#c0392b":warn?"#e67e22":color;
  return(<div style={{marginBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
      <span style={{color:"#444",fontWeight:600}}>{label}</span>
      <span style={{color:over?"#c0392b":"#555",fontWeight:700}}>{used}/{max}{over?" ⚠️ تجاوز":""}</span>
    </div>
    <div style={{background:"#e8edf5",borderRadius:10,height:9,overflow:"hidden"}}>
      <div style={{width:`${pct}%`,background:bc,height:"100%",borderRadius:10,transition:"width 0.4s"}}/>
    </div>
  </div>);
}

function Modal({title,onClose,children}){return(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,20,0.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:540,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
      <div style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff",padding:"16px 20px",borderRadius:"12px 12px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h3 style={{margin:0,fontSize:16,fontWeight:700}}>{title}</h3>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:16,fontFamily:"inherit"}}>✕</button>
      </div>
      <div style={{padding:24}}>{children}</div>
    </div>
  </div>
);}

function FF({label,children,required}){return(
  <div style={{marginBottom:14}}>
    <label style={{display:"block",fontSize:13,fontWeight:600,color:"#0a2d5e",marginBottom:5}}>{label}{required&&<span style={{color:"#c0392b"}}> *</span>}</label>
    {children}
  </div>
);}

const iS={width:"100%",padding:"9px 12px",border:"1.5px solid #c8d4e8",borderRadius:8,fontSize:14,boxSizing:"border-box",fontFamily:"inherit",outline:"none"};
const sS={...iS,background:"#fff"};
const bP={background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"inherit"};
const bS={background:"#f0f4fa",color:"#0a2d5e",border:"1.5px solid #c8d4e8",borderRadius:8,padding:"10px 20px",cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"inherit"};
const bSm={...bP,padding:"6px 12px",fontSize:12};
const bGold={background:"linear-gradient(135deg,#b8860b,#d4a017)",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"};
const bRed={background:"#c0392b",color:"#fff",border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:12,fontFamily:"inherit"};
const bGreen={background:"linear-gradient(135deg,#1a6b3a,#2d9e5e)",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit"};

// ===== APP =====
export default function App(){
  const [db,setDB]=useState(loadDB);
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("login");
  const [lf,setLF]=useState({username:"",password:""});
  const [le,setLE]=useState("");
  const now=new Date(); const cy=now.getFullYear(); const cm=now.getMonth()+1;
  const persist=(d)=>{setDB(d);saveDB(d);};
  // مزامنة Firebase في الوقت الفعلي
  useFirebaseSync(setDB);
  const login=()=>{const u=db.users.find(u=>u.username===lf.username&&u.password===lf.password);if(u){setUser(u);setPage("dashboard");setLE("");}else setLE("اسم المستخدم أو كلمة المرور غير صحيحة");};
  const logout=()=>{setUser(null);setPage("login");setLF({username:"",password:""});};
  if(!user) return <LoginPage form={lf} setForm={setLF} onLogin={login} error={le} db={db}/>;
  const isAdmin=user.role==="admin";
  const myStats=user.employeeId?calcStats(user.employeeId,db,cy,cm):null;
  return(
    <div style={{minHeight:"100vh",background:"#f0f4fa",fontFamily:"'Segoe UI',Tahoma,Arial,sans-serif",direction:"rtl"}}>
      <Header onLogout={logout} user={user} page={page} setPage={setPage} isAdmin={isAdmin} myStats={myStats}/>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 16px"}}>
        {page==="dashboard"   && <Dashboard   db={db} user={user} isAdmin={isAdmin} cy={cy} cm={cm}/>}
        {page==="myaccount"   && !isAdmin && <MyAccount db={db} user={user} cy={cy} cm={cm} persist={persist}/>}
        {page==="employees"   && isAdmin  && <EmployeesPage db={db} persist={persist} cy={cy} cm={cm}/>}
        {page==="accounts"    && isAdmin  && <AccountsPage db={db} persist={persist}/>}
        {page==="attendance"  && <AttendancePage db={db} persist={persist} user={user} isAdmin={isAdmin} cy={cy} cm={cm}/>}
        {page==="late"        && isAdmin  && <LatePage db={db} persist={persist} cy={cy} cm={cm}/>}
        {page==="permissions" && <PermissionsPage db={db} persist={persist} user={user} isAdmin={isAdmin} cy={cy} cm={cm}/>}
        {page==="leaves"      && <LeavesPage db={db} persist={persist} user={user} isAdmin={isAdmin} cy={cy} cm={cm}/>}
        {page==="reports"     && isAdmin  && <ReportsPage db={db} cy={cy} cm={cm}/>}
        {page==="messages"    && isAdmin  && <MessagesPage db={db} persist={persist}/>}
      </div>
    </div>
  );
}

// ===== LOGIN =====
function LoginPage({form,setForm,onLogin,error,db}){return(
  <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#06173a,#0a2d5e 50%,#0d3a7a)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,direction:"rtl"}}>
    <div style={{background:"#fff",borderRadius:16,padding:"40px 36px",width:"100%",maxWidth:440,boxShadow:"0 30px 80px rgba(0,0,0,0.4)"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <img src={MOI_LOGO} alt="شعار" style={{width:90,height:90,objectFit:"contain",margin:"0 auto 12px",display:"block",filter:"drop-shadow(0 2px 8px rgba(10,45,94,0.18))"}}/>
        <div style={{fontSize:11,color:"#888",lineHeight:1.8,marginBottom:4}}>وزارة الداخلية | قطاع التعليم والتدريب<br/>الإدارة العامة للتدريب | إدارة التنسيق والمتابعة<br/>قسم المعلومات والإحصاء</div>
        <h2 style={{color:"#0a2d5e",fontSize:17,fontWeight:800,margin:"12px 0 4px"}}>منصة رصد قسم المعلومات والإحصاء</h2>
        <div style={{width:50,height:3,background:"linear-gradient(90deg,#b8860b,#d4a017)",borderRadius:2,margin:"0 auto"}}/>
      </div>
      <FF label="اسم المستخدم" required><input style={iS} value={form.username} onChange={e=>setForm({...form,username:e.target.value})} onKeyDown={e=>e.key==="Enter"&&onLogin()} placeholder="أدخل اسم المستخدم"/></FF>
      <FF label="كلمة المرور" required><input type="password" style={iS} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&onLogin()} placeholder="أدخل كلمة المرور"/></FF>
      {error&&<div style={{background:"#f8d7da",color:"#721c24",padding:"10px 14px",borderRadius:8,fontSize:13,marginBottom:16}}>{error}</div>}
      <button style={{...bP,width:"100%",padding:12,fontSize:15}} onClick={onLogin}>تسجيل الدخول</button>
      <button style={{width:"100%",marginTop:8,padding:"9px",background:"#fff3cd",color:"#856404",border:"1.5px solid #ffc107",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit",fontWeight:600}}
        onClick={()=>{
          try { localStorage.clear(); } catch(e) {}
          window.location.reload();
        }}>
        🔄 مسح البيانات القديمة وإعادة التشغيل
      </button>
      
    </div>
  </div>
);}

// ===== HEADER =====
const navItems=[
  {key:"dashboard",   label:"لوحة التحكم",     icon:"📊",adminOnly:false},
  {key:"myaccount",   label:"حسابي",           icon:"👤",adminOnly:false,empOnly:true},
  {key:"employees",   label:"الموظفات",        icon:"👥",adminOnly:true},
  {key:"accounts",    label:"الحسابات",        icon:"🔑",adminOnly:true},
  {key:"attendance",  label:"الحضور",          icon:"📅",adminOnly:false},
  {key:"late",        label:"التأخير",         icon:"⏰",adminOnly:true},
  {key:"permissions", label:"الاستئذانات",     icon:"📝",adminOnly:false},
  {key:"leaves",      label:"الإجازات",        icon:"🗓️",adminOnly:false},
  {key:"reports",     label:"التقارير",        icon:"📈",adminOnly:true},
  {key:"messages",    label:"الرسائل",         icon:"📨",adminOnly:true},
];
function Header({onLogout,user,page,setPage,isAdmin,myStats}){
  const alerts=myStats?[myStats.lateOver,myStats.permOver,myStats.sickOver,myStats.emergOver].filter(Boolean).length:0;
  return(<>
    <div style={{background:"linear-gradient(135deg,#06173a,#0a2d5e)",color:"#fff",padding:"10px 20px",direction:"rtl"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <img src={MOI_LOGO} alt="" style={{width:52,height:52,objectFit:"contain",filter:"brightness(1.08)"}}/>
          <div>
            <div style={{fontSize:10,color:"#a8c4e8",lineHeight:1.6}}>وزارة الداخلية | قطاع التعليم والتدريب | الإدارة العامة للتدريب | إدارة التنسيق والمتابعة | قسم المعلومات والإحصاء</div>
            <div style={{fontSize:15,fontWeight:800,color:"#d4a017"}}>منصة رصد قسم المعلومات والإحصاء</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {alerts>0&&<span style={{background:"#c0392b",color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700}}>⚠️ {alerts} تنبيه</span>}
          <span style={{fontSize:13,color:"#a8c4e8"}}>مرحباً، {user.rank?`${user.rank} / ${user.name}`:user.name}</span>
          <button onClick={onLogout} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>خروج</button>
        </div>
      </div>
    </div>
    <nav style={{background:"#0d3a7a",padding:"0 20px",overflowX:"auto"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",gap:2}}>
        {navItems.filter(n=>{if(n.adminOnly&&!isAdmin)return false;if(n.empOnly&&isAdmin)return false;return true;}).map(n=>(
          <button key={n.key} onClick={()=>setPage(n.key)}
            style={{background:page===n.key?"rgba(212,160,23,0.25)":"transparent",color:page===n.key?"#d4a017":"#a8c4e8",border:"none",borderBottom:page===n.key?"3px solid #d4a017":"3px solid transparent",padding:"12px 14px",cursor:"pointer",fontSize:13,fontWeight:page===n.key?700:400,whiteSpace:"nowrap",fontFamily:"inherit"}}>
            {n.icon} {n.label}
          </button>
        ))}
      </div>
    </nav>
  </>);
}

// ===== DASHBOARD =====
function Dashboard({db,user,isAdmin,cy,cm}){
  const today=new Date().toISOString().split("T")[0];
  const ta=db.attendance.filter(a=>a.date===today);
  const cards=[
    {l:"إجمالي الموظفات",v:db.employees.length,c:"#0a2d5e",bg:"#e8f0fa",i:"👥"},
    {l:"حاضرات اليوم",v:ta.filter(a=>a.status==="present").length,c:"#1a6b3a",bg:"#d4edda",i:"✅"},
    {l:"متأخرات اليوم",v:ta.filter(a=>a.status==="late").length,c:"#856404",bg:"#fff3cd",i:"⏰"},
    {l:"غائبات اليوم",v:ta.filter(a=>a.status==="absent").length,c:"#721c24",bg:"#f8d7da",i:"❌"},
    {l:"في إجازة",v:ta.filter(a=>a.status==="leave").length,c:"#004085",bg:"#cce5ff",i:"🗓️"},
    {l:"طلبات معلقة",v:db.permissions.filter(p=>p.status==="pending").length,c:"#5a3878",bg:"#e8d8f5",i:"📝"},
  ];
  const violations=isAdmin?db.employees.map(emp=>{
    const s=calcStats(emp.id,db,cy,cm);
    const v=[];
    if(s.lateOver) v.push(`تأخير ${s.lateMin}د`);
    if(s.permOver) v.push("استنفاد استئذانات");
    if(s.sickOver) v.push("استنفاد إجازة مرضية");
    if(s.emergOver) v.push("استنفاد إجازة طارئة");
    return v.length?{emp,v}:null;
  }).filter(Boolean):[];

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <h2 style={{margin:0,color:"#0a2d5e",fontSize:20,fontWeight:800}}>لوحة التحكم الرئيسية</h2>
      <span style={{color:"#888",fontSize:13}}>📅 {new Date().toLocaleDateString("ar-KW",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</span>
    </div>

    {/* جدول أوقات الدوام */}
    <div style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",borderRadius:12,padding:16,marginBottom:20,color:"#fff"}}>
      <h3 style={{margin:"0 0 12px",fontSize:14,color:"#d4a017"}}>🕐 نظام أوقات الدوام الرسمي</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
        {[
          {l:"بداية الدوام الرسمي",v:"7:30 ص",note:""},
          {l:"نهاية فترة السماح",v:"8:00 ص",note:"لا تأخير حتى هذه اللحظة"},
          {l:"انصراف الحاضر 7:30↓",v:"12:45 م",note:""},
          {l:"انصراف الحاضر 7:31-8:00",v:"1:15 م",note:""},
          {l:"بصمة التواجد",v:"9:31-10:30 ص",note:"تنبيه صوتي"},
          {l:"حد التأخير الشهري",v:"95 دقيقة",note:""},
        ].map((x,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,0.12)",borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontSize:11,color:"#a8c4e8"}}>{x.l}</div>
            <div style={{fontSize:16,fontWeight:700,color:"#d4a017"}}>{x.v}</div>
            {x.note&&<div style={{fontSize:10,color:"#7eb3e8"}}>{x.note}</div>}
          </div>
        ))}
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:16,marginBottom:24}}>
      {cards.map((c,i)=>(
        <div key={i} style={{background:c.bg,borderRadius:12,padding:"18px 16px",textAlign:"center",border:`1.5px solid ${c.c}22`}}>
          <div style={{fontSize:26,marginBottom:6}}>{c.i}</div>
          <div style={{fontSize:28,fontWeight:800,color:c.c}}>{c.v}</div>
          <div style={{fontSize:12,color:c.c,marginTop:4,fontWeight:600}}>{c.l}</div>
        </div>
      ))}
    </div>

    {violations.length>0&&(
      <div style={{background:"#fff3cd",border:"1.5px solid #ffc107",borderRadius:12,padding:16,marginBottom:20}}>
        <h3 style={{color:"#856404",margin:"0 0 12px",fontSize:14}}>⚠️ تجاوز الحدود المقررة هذا الشهر</h3>
        {violations.map((x,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #ffeaa7",fontSize:13}}>
            <span style={{fontWeight:700,color:"#856404"}}>{x.emp.name}</span>
            <span style={{color:"#6d4c00"}}>{x.v.join(" | ")}</span>
          </div>
        ))}
      </div>
    )}

    {isAdmin&&(
      <div style={{background:"#fff",borderRadius:12,padding:20,border:"1.5px solid #e0e8f4"}}>
        <h3 style={{margin:"0 0 14px",color:"#0a2d5e",fontSize:15,fontWeight:700}}>📊 رصيد الموظفات — {new Date().toLocaleDateString("ar-KW",{month:"long",year:"numeric"})}</h3>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#f0f4fa"}}>
              {["الموظفة","تأخير الشهر","الاستئذانات","إجازة مرضية/سنة","إجازة طارئة/شهر","الحالة"].map(h=>(
                <th key={h} style={{padding:"8px 12px",textAlign:"right",color:"#0a2d5e",fontWeight:700}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{db.employees.map((emp,i)=>{
              const s=calcStats(emp.id,db,cy,cm);
              const ok=!s.lateOver&&!s.permOver&&!s.sickOver&&!s.emergOver;
              return(<tr key={emp.id} style={{background:!ok?"#fff8f0":i%2===0?"#f8faff":"#fff"}}>
                <td style={{padding:"8px 12px",fontWeight:600,color:"#0a2d5e"}}>{emp.name}</td>
                <td style={{padding:"8px 12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{color:s.lateOver?"#c0392b":"#333",fontWeight:s.lateOver?700:400}}>{s.lateMin}/{LIMITS.lateMinutesPerMonth}د</span>
                    <div style={{flex:1,background:"#e8edf5",borderRadius:8,height:6,minWidth:50}}>
                      <div style={{width:`${Math.min(100,s.lateMin/LIMITS.lateMinutesPerMonth*100)}%`,background:s.lateOver?"#c0392b":s.lateMin>70?"#e67e22":"#1a4a8a",height:"100%",borderRadius:8}}/>
                    </div>
                  </div>
                </td>
                <td style={{padding:"8px 12px",color:s.permOver?"#c0392b":"#333",fontWeight:s.permOver?700:400}}>{s.permMonth}/{LIMITS.permissionsPerMonth}{s.permOver?" ⚠️":""}</td>
                <td style={{padding:"8px 12px",color:s.sickOver?"#c0392b":"#333",fontWeight:s.sickOver?700:400}}>{s.sickYear}/{LIMITS.sickLeavesPerYear}{s.sickOver?" ⚠️":""}</td>
                <td style={{padding:"8px 12px",color:s.emergOver?"#c0392b":"#333",fontWeight:s.emergOver?700:400}}>{s.emergMonth}/{LIMITS.emergencyLeavesPerMonth}{s.emergOver?" ⚠️":""}</td>
                <td style={{padding:"8px 12px"}}>{ok?<span style={{background:"#d4edda",color:"#1a6b3a",padding:"2px 8px",borderRadius:20,fontSize:11}}>✓ طبيعي</span>:<span style={{background:"#f8d7da",color:"#721c24",padding:"2px 8px",borderRadius:20,fontSize:11}}>⚠️ تجاوز</span>}</td>
              </tr>);
            })}</tbody>
          </table>
        </div>
      </div>
    )}
  </div>);
}

// ===== ATTENDANCE PAGE =====
function AttendancePage({db,persist,user,isAdmin,cy,cm}){
  const [date,setDate]=useState(new Date().toISOString().split("T")[0]);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [alert,setAlert]=useState(null);
  const audioCtx=useRef(null);

  const playBeep=()=>{
    try{
      if(!audioCtx.current) audioCtx.current=new (window.AudioContext||window.webkitAudioContext)();
      const ctx=audioCtx.current;
      [0,0.3,0.6].forEach(t=>{
        const o=ctx.createOscillator(); const g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value=880; o.type="sine";
        g.gain.setValueAtTime(0.4,ctx.currentTime+t);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.25);
        o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.25);
      });
    }catch(e){}
  };

  const empList=isAdmin?db.employees:db.employees.filter(e=>e.id===user.employeeId);
  const recs=db.attendance.filter(a=>a.date===date&&empList.some(e=>e.id===a.employeeId));

  const openAdd=(empId)=>{setForm({employeeId:empId,date,checkIn:"",checkOut:"",presenceStamp:"",status:"present",notes:""});setModal("add");};
  const openEdit=(r)=>{setForm({...r});setModal("edit");};

  const handleSave=()=>{
    const newDB={...db};
    const ci=form.checkIn;
    const lateMin=calcLateMinutes(ci);
    const status=getAttendanceStatus(ci);
    const expectedCO=getExpectedCheckout(ci);
    const pStamp=form.presenceStamp;

    // تنبيه صوتي إذا بصمة التواجد في النافذة المحددة
    if(pStamp&&isInPresenceWindow(pStamp)){
      playBeep();
      setAlert(`🔔 تنبيه: بصمة التواجد (${pStamp}) سُجلت ضمن نافذة الإثبات الإلزامي (9:31-10:30)`);
      setTimeout(()=>setAlert(null),5000);
    }

    if(modal==="add"){
      const newId=Math.max(...db.attendance.map(a=>a.id),0)+1;
      const rec={...form,id:newId,status,checkOut:form.checkOut||expectedCO||"",presenceStamp:pStamp};
      newDB.attendance=[...db.attendance,rec];
      // إضافة سجل تأخير تلقائياً
      if(lateMin>0&&ci){
        const lid=Math.max(...db.lateRecords.map(l=>l.id),0)+1;
        newDB.lateRecords=[...db.lateRecords,{id:lid,employeeId:form.employeeId,date:form.date,checkIn:ci,duration:lateMin,reason:"",approved:false,approvedBy:""}];
      }
    } else {
      newDB.attendance=db.attendance.map(a=>a.id===form.id?{...form,status,checkOut:form.checkOut||expectedCO||""}:a);
    }
    persist(newDB);setModal(null);
  };

  const handleDel=(id)=>{if(!confirm("حذف؟"))return;persist({...db,attendance:db.attendance.filter(a=>a.id!==id)});};

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <h2 style={{margin:0,color:"#0a2d5e",fontSize:20,fontWeight:800}}>📅 الحضور والانصراف</h2>
      <input type="date" style={{...iS,width:"auto"}} value={date} onChange={e=>setDate(e.target.value)}/>
    </div>

    {/* بطاقة قواعد الدوام */}
    <div style={{background:"#e8f0fa",borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:13,color:"#0a2d5e"}}>
      <strong>📋 قواعد الدوام:</strong>
      <span style={{marginRight:16}}>حضور ≤7:30 → انصراف 12:45</span>
      <span style={{marginRight:16}}>حضور 7:31-8:00 → انصراف 1:15</span>
      <span style={{marginRight:16}}>حضور ≥8:01 → تأخير محسوب من 7:30</span>
      <span style={{color:"#c0392b",fontWeight:700}}>بصمة التواجد الإلزامية: 9:31-10:30 🔔</span>
    </div>

    {alert&&(
      <div style={{background:"#fff3cd",border:"2px solid #ffc107",borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:14,color:"#856404",fontWeight:700,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:24}}>🔔</span>{alert}
      </div>
    )}

    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>
          {["الموظفة","وقت الحضور","وقت الانصراف المقرر","وقت الانصراف الفعلي","التأخير","بصمة التواجد","الحالة","إجراءات"].map(h=>(
            <th key={h} style={{padding:"11px 12px",textAlign:"right",fontSize:12}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{empList.map((emp,i)=>{
          const r=recs.find(a=>a.employeeId===emp.id);
          const lateMin=r?.checkIn?calcLateMinutes(r.checkIn):0;
          const expCO=r?.checkIn?getExpectedCheckout(r.checkIn):null;
          const inPW=r?.presenceStamp&&isInPresenceWindow(r.presenceStamp);
          return(<tr key={emp.id} style={{background:i%2===0?"#f8faff":"#fff"}}>
            <td style={{padding:"11px 12px",fontWeight:600,color:"#0a2d5e"}}>{emp.name}</td>
            <td style={{padding:"11px 12px"}}>{r?.checkIn||"-"}</td>
            <td style={{padding:"11px 12px",color:"#555",fontStyle:"italic"}}>{expCO||"-"}</td>
            <td style={{padding:"11px 12px"}}>{r?.checkOut||"-"}</td>
            <td style={{padding:"11px 12px"}}>
              {lateMin>0?<span style={{background:"#fff3cd",color:"#856404",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700}}>{lateMin} د ⏰</span>:<span style={{color:"#aaa"}}>—</span>}
            </td>
            <td style={{padding:"11px 12px"}}>
              {r?.presenceStamp?(
                <span style={{background:inPW?"#d4edda":"#e8f0fa",color:inPW?"#1a6b3a":"#555",padding:"3px 8px",borderRadius:20,fontSize:12}}>
                  {r.presenceStamp}{inPW?" 🔔":""}
                </span>
              ):<span style={{color:"#aaa"}}>—</span>}
            </td>
            <td style={{padding:"11px 12px"}}>{r?<Badge status={r.status} map={statusMap}/>:<span style={{color:"#aaa",fontSize:12}}>لم يسجل</span>}</td>
            <td style={{padding:"11px 12px"}}>
              {isAdmin&&(r?(
                <div style={{display:"flex",gap:5}}>
                  <button style={bSm} onClick={()=>openEdit(r)}>تعديل</button>
                  <button style={bRed} onClick={()=>handleDel(r.id)}>حذف</button>
                </div>
              ):<button style={bGold} onClick={()=>openAdd(emp.id)}>+ تسجيل</button>)}
            </td>
          </tr>);
        })}</tbody>
      </table>
    </div>

    {modal&&(
      <Modal title={modal==="add"?"تسجيل حضور":"تعديل سجل الحضور"} onClose={()=>setModal(null)}>
        {isAdmin&&<FF label="الموظفة"><select style={sS} value={form.employeeId} onChange={e=>setForm({...form,employeeId:parseInt(e.target.value)})}>{db.employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></FF>}
        <FF label="التاريخ"><input type="date" style={iS} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></FF>
        <FF label="وقت الحضور">
          <input type="time" style={iS} value={form.checkIn} onChange={e=>setForm({...form,checkIn:e.target.value})}/>
        </FF>

        {/* معلومات الحضور المحسوبة */}
        {form.checkIn&&(()=>{
          const lm=calcLateMinutes(form.checkIn);
          const expco=getExpectedCheckout(form.checkIn);
          const st=getAttendanceStatus(form.checkIn);
          return(<div style={{background:lm>0?"#fff3cd":"#d4edda",border:`1.5px solid ${lm>0?"#ffc107":"#28a745"}`,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13}}>
            <div style={{fontWeight:700,color:lm>0?"#856404":"#1a6b3a",marginBottom:4}}>
              {lm>0?`⏰ تأخير: ${lm} دقيقة (من 7:30 حتى ${form.checkIn})`:"✅ حضور في الوقت المحدد"}
            </div>
            {expco&&<div style={{color:"#555"}}>🕐 وقت الانصراف المقرر: <strong>{expco}</strong></div>}
            <div style={{color:"#555"}}>الحالة: <Badge status={st} map={statusMap}/></div>
          </div>);
        })()}

        <FF label={`بصمة التواجد الإلزامية (9:31-10:30) 🔔`}>
          <input type="time" style={iS} value={form.presenceStamp} onChange={e=>{
            const v=e.target.value;
            setForm({...form,presenceStamp:v});
            if(v&&isInPresenceWindow(v)){playBeep();}
          }}/>
          {form.presenceStamp&&isInPresenceWindow(form.presenceStamp)&&(
            <div style={{background:"#d4edda",color:"#1a6b3a",padding:"6px 10px",borderRadius:6,fontSize:12,marginTop:6,fontWeight:600}}>
              🔔 بصمة التواجد مسجلة ضمن النافذة الإلزامية ✓
            </div>
          )}
          {form.presenceStamp&&!isInPresenceWindow(form.presenceStamp)&&(
            <div style={{background:"#f8d7da",color:"#721c24",padding:"6px 10px",borderRadius:6,fontSize:12,marginTop:6}}>
              ⚠️ البصمة خارج نافذة التواجد الإلزامية (9:31-10:30)
            </div>
          )}
        </FF>

        <FF label="وقت الانصراف الفعلي"><input type="time" style={iS} value={form.checkOut} onChange={e=>setForm({...form,checkOut:e.target.value})}/></FF>
        <FF label="ملاحظات"><textarea style={{...iS,height:65,resize:"vertical"}} value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})}/></FF>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button style={bS} onClick={()=>setModal(null)}>إلغاء</button>
          <button style={bP} onClick={handleSave}>💾 حفظ</button>
        </div>
      </Modal>
    )}
  </div>);
}

// ===== LATE PAGE =====
function LatePage({db,persist,cy,cm}){
  // مجاميع التأخير الشهرية لكل موظفة
  const empLateStats=db.employees.map(emp=>{
    const ym=`${cy}-${String(cm).padStart(2,"0")}`;
    const recs=db.lateRecords.filter(l=>l.employeeId===emp.id&&l.date.startsWith(ym));
    const total=recs.reduce((s,r)=>s+r.duration,0);
    return {emp,recs,total,over:total>LIMITS.lateMinutesPerMonth,remain:Math.max(0,LIMITS.lateMinutesPerMonth-total)};
  });

  const approve=(id)=>persist({...db,lateRecords:db.lateRecords.map(l=>l.id===id?{...l,approved:true,approvedBy:"رئيس القسم"}:l)});

  return(<div>
    <h2 style={{color:"#0a2d5e",fontSize:20,fontWeight:800,marginBottom:20}}>⏰ سجلات التأخير</h2>

    {/* شريط مجاميع شهري */}
    <div style={{background:"#fff",borderRadius:12,padding:20,marginBottom:20,border:"1.5px solid #e0e8f4"}}>
      <h3 style={{margin:"0 0 16px",color:"#0a2d5e",fontSize:15,fontWeight:700}}>📊 رصيد التأخير الشهري — الحد الأقصى {LIMITS.lateMinutesPerMonth} دقيقة</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
        {empLateStats.map(({emp,total,over,remain})=>(
          <div key={emp.id} style={{padding:"12px 14px",background:over?"#fff3cd":"#f8faff",borderRadius:10,border:`1.5px solid ${over?"#ffc107":"#e0e8f4"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontWeight:700,fontSize:13,color:"#0a2d5e"}}>{emp.name}</span>
              <span style={{fontSize:13,fontWeight:700,color:over?"#c0392b":"#1a6b3a"}}>{total}/{LIMITS.lateMinutesPerMonth} د {over?"⚠️":"✓"}</span>
            </div>
            <div style={{background:"#e8edf5",borderRadius:10,height:10,overflow:"hidden"}}>
              <div style={{width:`${Math.min(100,total/LIMITS.lateMinutesPerMonth*100)}%`,background:over?"#c0392b":total>70?"#e67e22":"#1a4a8a",height:"100%",borderRadius:10,transition:"width 0.4s"}}/>
            </div>
            <div style={{fontSize:11,color:"#777",marginTop:4}}>{over?`تجاوز بـ${total-LIMITS.lateMinutesPerMonth} دقيقة`:`متبقٍ: ${remain} دقيقة`}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>
          {["الموظفة","التاريخ","وقت الحضور","التأخير (من 7:30)","السبب","الاعتماد","إجراءات"].map(h=>(
            <th key={h} style={{padding:"12px 14px",textAlign:"right"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{db.lateRecords.map((r,i)=>{
          const emp=db.employees.find(e=>e.id===r.employeeId);
          return(<tr key={r.id} style={{background:i%2===0?"#f8faff":"#fff"}}>
            <td style={{padding:"12px 14px",fontWeight:600,color:"#0a2d5e"}}>{emp?.name}</td>
            <td style={{padding:"12px 14px"}}>{r.date}</td>
            <td style={{padding:"12px 14px"}}>{r.checkIn}</td>
            <td style={{padding:"12px 14px"}}><span style={{background:"#fff3cd",color:"#856404",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700}}>{r.duration} دقيقة</span></td>
            <td style={{padding:"12px 14px",color:"#666"}}>{r.reason||"-"}</td>
            <td style={{padding:"12px 14px"}}>{r.approved?<span style={{background:"#d4edda",color:"#1a6b3a",padding:"3px 10px",borderRadius:20,fontSize:12}}>✓ معتمد</span>:<span style={{background:"#f8d7da",color:"#721c24",padding:"3px 10px",borderRadius:20,fontSize:12}}>غير معتمد</span>}</td>
            <td style={{padding:"12px 14px"}}>{!r.approved&&<button style={bSm} onClick={()=>approve(r.id)}>اعتماد</button>}</td>
          </tr>);
        })}</tbody>
      </table>
    </div>
  </div>);
}

// ===== PERMISSIONS PAGE =====
function PermissionsPage({db,persist,user,isAdmin,cy,cm}){
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({});
  const list=isAdmin?db.permissions:db.permissions.filter(p=>p.employeeId===user.employeeId);

  const openAdd=()=>{
    const empId=isAdmin?db.employees[0]?.id:user.employeeId;
    if(!isAdmin){
      const s=calcStats(empId,db,cy,cm);
      if(s.permOver){alert(`⚠️ استنفدت جميع استئذاناتك هذا الشهر (${LIMITS.permissionsPerMonth}/4)`);return;}
    }
    setForm({employeeId:empId,date:new Date().toISOString().split("T")[0],exitTime:"",returnTime:"",reason:"",status:"pending",notes:""});
    setModal(true);
  };

  const save=()=>{
    if(!form.exitTime||!form.returnTime||!form.reason)return alert("يرجى ملء جميع الحقول");
    const s=calcStats(parseInt(form.employeeId),db,cy,cm);
    if(s.permOver&&!isAdmin){alert("تجاوز الحد الأقصى للاستئذانات");return;}
    const nid=Math.max(...db.permissions.map(p=>p.id),0)+1;
    persist({...db,permissions:[...db.permissions,{...form,id:nid,employeeId:parseInt(form.employeeId)}]});
    setModal(false);
  };

  const setStatus=(id,status)=>persist({...db,permissions:db.permissions.map(p=>p.id===id?{...p,status}:p)});

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <h2 style={{margin:0,color:"#0a2d5e",fontSize:20,fontWeight:800}}>📝 الاستئذانات</h2>
      <button style={bP} onClick={openAdd}>+ طلب استئذان</button>
    </div>
    <div style={{background:"#e8f0fa",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13,color:"#0a2d5e"}}>
      📋 الحد الأقصى: <strong>{LIMITS.permissionsPerMonth} استئذانات شهرياً</strong> لكل موظفة.
    </div>
    {!isAdmin&&user.employeeId&&(()=>{const s=calcStats(user.employeeId,db,cy,cm);return(
      <div style={{background:"#fff",borderRadius:10,padding:"14px 16px",marginBottom:16,border:"1.5px solid #e0e8f4"}}>
        <LimitBar label="استئذاناتي هذا الشهر" used={s.permMonth} max={LIMITS.permissionsPerMonth} color="#5a3878"/>
      </div>
    );})()}
    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>
          {["الموظفة","التاريخ","الخروج","العودة","السبب","الحالة",...(isAdmin?["إجراءات"]:[])].map(h=>(
            <th key={h} style={{padding:"12px 14px",textAlign:"right"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{list.map((p,i)=>{
          const emp=db.employees.find(e=>e.id===p.employeeId);
          return(<tr key={p.id} style={{background:i%2===0?"#f8faff":"#fff"}}>
            <td style={{padding:"12px 14px",fontWeight:600,color:"#0a2d5e"}}>{emp?.name}</td>
            <td style={{padding:"12px 14px"}}>{p.date}</td>
            <td style={{padding:"12px 14px"}}>{p.exitTime}</td>
            <td style={{padding:"12px 14px"}}>{p.returnTime}</td>
            <td style={{padding:"12px 14px",color:"#555"}}>{p.reason}</td>
            <td style={{padding:"12px 14px"}}><Badge status={p.status} map={permSMap}/></td>
            {isAdmin&&<td style={{padding:"12px 14px"}}>{p.status==="pending"&&(
              <div style={{display:"flex",gap:6}}>
                <button style={bGreen} onClick={()=>setStatus(p.id,"approved")}>موافقة</button>
                <button style={bRed} onClick={()=>setStatus(p.id,"rejected")}>رفض</button>
              </div>
            )}</td>}
          </tr>);
        })}</tbody>
      </table>
    </div>
    {modal&&(
      <Modal title="طلب استئذان جديد" onClose={()=>setModal(false)}>
        {isAdmin&&<FF label="الموظفة"><select style={sS} value={form.employeeId} onChange={e=>{
          const id=parseInt(e.target.value);const s=calcStats(id,db,cy,cm);
          setForm({...form,employeeId:id});
          if(s.permOver)alert(`⚠️ هذه الموظفة استنفدت استئذاناتها (${s.permMonth}/${LIMITS.permissionsPerMonth})`);
        }}>{db.employees.map(e=>{const s=calcStats(e.id,db,cy,cm);return<option key={e.id} value={e.id}>{e.name} ({s.permMonth}/{LIMITS.permissionsPerMonth}){s.permOver?" ⚠️":""}</option>;})}</select></FF>}
        <FF label="التاريخ"><input type="date" style={iS} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></FF>
        <FF label="وقت الخروج" required><input type="time" style={iS} value={form.exitTime} onChange={e=>setForm({...form,exitTime:e.target.value})}/></FF>
        <FF label="وقت العودة" required><input type="time" style={iS} value={form.returnTime} onChange={e=>setForm({...form,returnTime:e.target.value})}/></FF>
        <FF label="السبب" required><textarea style={{...iS,height:70}} value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/></FF>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button style={bS} onClick={()=>setModal(false)}>إلغاء</button>
          <button style={bP} onClick={save}>📨 إرسال</button>
        </div>
      </Modal>
    )}
  </div>);
}

// ===== LEAVES PAGE =====
function LeavesPage({db,persist,user,isAdmin,cy,cm}){
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({});
  const list=isAdmin?db.leaves:db.leaves.filter(l=>l.employeeId===user.employeeId);
  const lc={annual:"#cce5ff",sick:"#fff3cd",excused:"#d4edda",unexcused:"#f8d7da",emergency:"#fde8d8"};
  const lt={annual:"#004085",sick:"#856404",excused:"#1a6b3a",unexcused:"#721c24",emergency:"#7d2b00"};

  const openAdd=()=>{
    setForm({employeeId:isAdmin?db.employees[0]?.id:user.employeeId,date:new Date().toISOString().split("T")[0],type:"annual",reason:""});
    setModal(true);
  };

  const save=()=>{
    if(!form.date||!form.type)return alert("يرجى ملء الحقول");
    const empId=parseInt(form.employeeId);
    const s=calcStats(empId,db,cy,cm);
    if(form.type==="sick"&&s.sickOver&&!isAdmin){alert(`⚠️ استنفدت رصيد الإجازة المرضية (${LIMITS.sickLeavesPerYear} أيام/سنة)`);return;}
    if(form.type==="emergency"&&s.emergOver&&!isAdmin){alert(`⚠️ استنفدت رصيد الإجازة الطارئة (${LIMITS.emergencyLeavesPerMonth} أيام/شهر)`);return;}
    const nid=Math.max(...db.leaves.map(l=>l.id),0)+1;
    persist({...db,leaves:[...db.leaves,{...form,id:nid,employeeId:empId,attachment:false}]});
    setModal(false);
  };

  const del=(id)=>{if(!confirm("حذف؟"))return;persist({...db,leaves:db.leaves.filter(l=>l.id!==id)});};

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <h2 style={{margin:0,color:"#0a2d5e",fontSize:20,fontWeight:800}}>🗓️ الإجازات والغياب</h2>
      <button style={bP} onClick={openAdd}>+ تسجيل</button>
    </div>
    <div style={{background:"#e8f0fa",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13,color:"#0a2d5e",display:"flex",gap:24,flexWrap:"wrap"}}>
      <span>🏥 إجازة مرضية: <strong>{LIMITS.sickLeavesPerYear} أيام/سنة</strong></span>
      <span>🚨 إجازة طارئة: <strong>{LIMITS.emergencyLeavesPerMonth} أيام/شهر</strong></span>
    </div>
    {!isAdmin&&user.employeeId&&(()=>{const s=calcStats(user.employeeId,db,cy,cm);return(
      <div style={{background:"#fff",borderRadius:10,padding:16,marginBottom:16,border:"1.5px solid #e0e8f4"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <LimitBar label="🏥 إجازة مرضية (هذه السنة)" used={s.sickYear} max={LIMITS.sickLeavesPerYear} color="#856404"/>
          <LimitBar label="🚨 إجازة طارئة (هذا الشهر)" used={s.emergMonth} max={LIMITS.emergencyLeavesPerMonth} color="#c0392b"/>
        </div>
      </div>
    );})()}
    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>
          {["الموظفة","التاريخ","النوع","السبب",...(isAdmin?["حذف"]:[])].map(h=>(
            <th key={h} style={{padding:"12px 14px",textAlign:"right"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{list.map((l,i)=>{
          const emp=db.employees.find(e=>e.id===l.employeeId);
          return(<tr key={l.id} style={{background:i%2===0?"#f8faff":"#fff"}}>
            <td style={{padding:"12px 14px",fontWeight:600,color:"#0a2d5e"}}>{emp?.name}</td>
            <td style={{padding:"12px 14px"}}>{l.date}</td>
            <td style={{padding:"12px 14px"}}><span style={{background:lc[l.type]||"#eee",color:lt[l.type]||"#333",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{leaveMap[l.type]||l.type}</span></td>
            <td style={{padding:"12px 14px",color:"#555"}}>{l.reason||"-"}</td>
            {isAdmin&&<td style={{padding:"12px 14px"}}><button style={bRed} onClick={()=>del(l.id)}>حذف</button></td>}
          </tr>);
        })}</tbody>
      </table>
    </div>
    {modal&&(
      <Modal title="تسجيل إجازة أو غياب" onClose={()=>setModal(false)}>
        {isAdmin&&<FF label="الموظفة"><select style={sS} value={form.employeeId} onChange={e=>setForm({...form,employeeId:e.target.value})}>{db.employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></FF>}
        <FF label="التاريخ" required><input type="date" style={iS} value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></FF>
        <FF label="النوع" required>
          <select style={sS} value={form.type} onChange={e=>{
            const empId=parseInt(form.employeeId||user.employeeId);
            const s=calcStats(empId,db,cy,cm);
            setForm({...form,type:e.target.value});
            if(e.target.value==="sick"&&s.sickOver)alert(`⚠️ استنفاد الإجازة المرضية (${LIMITS.sickLeavesPerYear} أيام)`);
            if(e.target.value==="emergency"&&s.emergOver)alert(`⚠️ استنفاد الإجازة الطارئة (${LIMITS.emergencyLeavesPerMonth} أيام)`);
          }}>
            <option value="annual">إجازة سنوية</option>
            <option value="sick">إجازة مرضية 🏥 ({LIMITS.sickLeavesPerYear} أيام/سنة)</option>
            <option value="emergency">إجازة طارئة 🚨 ({LIMITS.emergencyLeavesPerMonth} أيام/شهر)</option>
            <option value="excused">غياب بعذر</option>
            <option value="unexcused">غياب بدون عذر</option>
          </select>
        </FF>
        <FF label="السبب"><textarea style={{...iS,height:70}} value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})}/></FF>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button style={bS} onClick={()=>setModal(false)}>إلغاء</button>
          <button style={bP} onClick={save}>💾 حفظ</button>
        </div>
      </Modal>
    )}
  </div>);
}

// ===== MY ACCOUNT =====
function MyAccount({db,user,cy,cm,persist}){
  const emp=db.employees.find(e=>e.id===user.employeeId);
  const s=calcStats(user.employeeId,db,cy,cm);
  const u=db.users.find(u=>u.id===user.id);
  const today=new Date().toISOString().split("T")[0];
  const nowTime=new Date().toTimeString().slice(0,5);
  const todayRec=db.attendance.find(a=>a.employeeId===user.employeeId&&a.date===today);
  const audioCtx=useRef(null);

  const playBeep=()=>{
    try{
      if(!audioCtx.current) audioCtx.current=new(window.AudioContext||window.webkitAudioContext)();
      const ctx=audioCtx.current;
      [0,0.3,0.6].forEach(t=>{
        const o=ctx.createOscillator(),g=ctx.createGain();
        o.connect(g);g.connect(ctx.destination);
        o.frequency.value=880;o.type="sine";
        g.gain.setValueAtTime(0.4,ctx.currentTime+t);
        g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.25);
        o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.25);
      });
    }catch(e){}
  };

  const handleCheckIn=()=>{
    if(todayRec?.checkIn){alert("لقد سجلت حضورك اليوم بالفعل في "+todayRec.checkIn);return;}
    const ci=timeToMinutes(nowTime);
    const lateStart=timeToMinutes("08:01");
    const permThreshold=timeToMinutes("08:30");
    const lateMin=calcLateMinutes(nowTime);
    const status=getAttendanceStatus(nowTime);
    const expectedCO=getExpectedCheckout(nowTime);
    const stats=calcStats(user.employeeId,db,cy,cm);
    if(ci<=timeToMinutes("07:29")){
      doCheckIn(0,"present",getExpectedCheckout("07:29"),true);
      return;
    }
    if(ci>=timeToMinutes("07:30")&&ci<=timeToMinutes("08:00")){
      doCheckIn(0,"present",getExpectedCheckout("07:30"),true);
      return;
    }
    if(ci>=lateStart&&ci<=permThreshold){
      doCheckIn(lateMin,"late",expectedCO,true);
      return;
    }
    if(ci>permThreshold){
      if(stats.permOver){
        alert("لا يوجد رصيد استئذان هذا الشهر - استخدمت "+stats.permMonth+" من "+LIMITS.permissionsPerMonth+" - سيسجل تاخير "+lateMin+" دقيقة");
        doCheckIn(lateMin,"late",expectedCO,false);
        return;
      }
      const wantPerm=window.confirm("حضورك بعد 8:30 - التاخير: "+lateMin+" دقيقة من 7:30 - هل تريد تسجيل استئذان من بداية الدوام 7:30؟ - الرصيد: "+stats.permRemain);
      if(wantPerm){
        const pid=Math.max(...db.permissions.map(p=>p.id),0)+1;
        const permRec={id:pid,employeeId:user.employeeId,date:today,exitTime:"07:30",returnTime:nowTime,reason:"استئذان - تاخر عن الدوام",status:"pending",notes:"طلب تلقائي - تاخير "+lateMin+" دقيقة"};
        const newDB2={...db,permissions:[...db.permissions,permRec]};
        const newId=Math.max(...newDB2.attendance.map(a=>a.id),0)+1;
        const rec={id:newId,employeeId:user.employeeId,date:today,checkIn:nowTime,checkOut:"",presenceStamp:"",status:"permission",notes:"استئذان من 7:30 حتى "+nowTime};
        newDB2.attendance=[...newDB2.attendance,rec];
        persist(newDB2);
        alert("تم ارسال طلب الاستئذان - من 7:30 حتى "+nowTime+" - الرصيد المتبقي: "+(stats.permRemain-1));
        return;
      }
      doCheckIn(lateMin,"late",expectedCO,true);
    }
  };

  const doCheckIn=(lateMin,status,expectedCO,showMsg)=>{
    const newId=Math.max(...db.attendance.map(a=>a.id),0)+1;
    const rec={id:newId,employeeId:user.employeeId,date:today,checkIn:nowTime,checkOut:"",presenceStamp:"",status,notes:""};
    const newDB={...db,attendance:[...db.attendance,rec]};
    if(lateMin>0){
      const lid=Math.max(...db.lateRecords.map(l=>l.id),0)+1;
      newDB.lateRecords=[...db.lateRecords,{id:lid,employeeId:user.employeeId,date:today,checkIn:nowTime,duration:lateMin,reason:"",approved:false,approvedBy:""}];
    }
    persist(newDB);
    if(showMsg){
      const co=expectedCO?" - الانصراف: "+expectedCO:"";
      alert(lateMin>0?"تم تسجيل حضورك - تاخير "+lateMin+" دقيقة"+co:"تم تسجيل حضورك - الوقت: "+nowTime+co);
    }
  };

  const handlePresenceStamp=()=>{
    if(!todayRec){alert("⚠️ يجب تسجيل الحضور أولاً");return;}
    if(todayRec.presenceStamp){alert("✅ تم تسجيل بصمة التواجد مسبقاً في "+todayRec.presenceStamp);return;}
    const inWindow=isInPresenceWindow(nowTime);
    const newDB={...db,attendance:db.attendance.map(a=>a.id===todayRec.id?{...a,presenceStamp:nowTime}:a)};
    persist(newDB);
    if(inWindow){
      playBeep();
      alert(`🔔 تم تسجيل بصمة التواجد\nالوقت: ${nowTime}\n✅ ضمن النافذة الإلزامية (9:31 - 10:30)`);
    } else {
      alert(`⚠️ تم تسجيل بصمة التواجد\nالوقت: ${nowTime}\nتنبيه: خارج النافذة الإلزامية (9:31 - 10:30)`);
    }
  };

  const handleCheckOut=()=>{
    if(!todayRec){alert("⚠️ يجب تسجيل الحضور أولاً");return;}
    if(todayRec.checkOut){alert("✅ تم تسجيل انصرافك اليوم في "+todayRec.checkOut);return;}
    const newDB={...db,attendance:db.attendance.map(a=>a.id===todayRec.id?{...a,checkOut:nowTime}:a)};
    persist(newDB);
    alert(`✅ تم تسجيل الانصراف\nالوقت: ${nowTime}`);
  };

  if(!emp)return<div>لم يتم العثور على بياناتك</div>;
  const alerts=[];
  if(s.lateOver)alerts.push({msg:`تجاوزت حد التأخير (${s.lateMin}/${LIMITS.lateMinutesPerMonth}د)`,t:"danger"});
  if(s.permOver)alerts.push({msg:`استنفدت استئذانات الشهر (${LIMITS.permissionsPerMonth}/4)`,t:"danger"});
  if(s.sickOver)alerts.push({msg:`استنفدت الإجازة المرضية (${LIMITS.sickLeavesPerYear} أيام)`,t:"danger"});
  if(s.emergOver)alerts.push({msg:`استنفدت الإجازة الطارئة (${LIMITS.emergencyLeavesPerMonth} أيام)`,t:"danger"});
  if(!s.lateOver&&s.lateMin/LIMITS.lateMinutesPerMonth>0.75)alerts.push({msg:`اقتربت من حد التأخير: ${s.lateMin}/${LIMITS.lateMinutesPerMonth}د`,t:"warn"});

  const lateNow=calcLateMinutes(nowTime);
  const expCO=getExpectedCheckout(nowTime);

  return(<div>
    <h2 style={{color:"#0a2d5e",fontSize:20,fontWeight:800,marginBottom:20}}>👤 حسابي الشخصي</h2>

    {/* === بطاقة تسجيل الحضور اليومي === */}
    <div style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",borderRadius:14,padding:24,marginBottom:20,color:"#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:13,color:"#a8c4e8",marginBottom:4}}>📅 {new Date().toLocaleDateString("ar-KW",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
          <div style={{fontSize:28,fontWeight:800,color:"#d4a017",letterSpacing:2}}>{nowTime}</div>
          <div style={{fontSize:12,color:"#a8c4e8",marginTop:4}}>
            {lateNow>0?<span style={{color:"#ff9999"}}>⏰ ستُسجَّل بتأخير {lateNow} دقيقة</span>:<span style={{color:"#90ee90"}}>✅ ضمن وقت الدوام</span>}
          </div>
          {expCO&&<div style={{fontSize:12,color:"#a8c4e8",marginTop:2}}>🕐 وقت الانصراف المقرر: <strong style={{color:"#d4a017"}}>{expCO}</strong></div>}
        </div>
        <div style={{textAlign:"left"}}>
          {todayRec?.checkIn
            ?<div style={{background:"rgba(255,255,255,0.15)",borderRadius:10,padding:"10px 16px",textAlign:"center"}}>
                <div style={{fontSize:11,color:"#a8c4e8"}}>سُجِّل الحضور</div>
                <div style={{fontSize:20,fontWeight:700,color:"#90ee90"}}>{todayRec.checkIn} ✓</div>
                {todayRec.presenceStamp&&<div style={{fontSize:11,color:"#a8c4e8",marginTop:4}}>بصمة التواجد: {todayRec.presenceStamp} 🔔</div>}
                {todayRec.checkOut&&<div style={{fontSize:11,color:"#a8c4e8",marginTop:4}}>الانصراف: {todayRec.checkOut} ✓</div>}
              </div>
            :<div style={{background:"rgba(255,100,100,0.2)",borderRadius:10,padding:"10px 16px",textAlign:"center"}}>
                <div style={{fontSize:13,color:"#ffaaaa"}}>لم يُسجَّل الحضور بعد</div>
              </div>
          }
        </div>
      </div>

      {/* أزرار التسجيل */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:20}}>
        {/* زر الحضور */}
        <button onClick={handleCheckIn} disabled={!!todayRec?.checkIn}
          style={{padding:"14px 10px",borderRadius:10,border:"none",cursor:todayRec?.checkIn?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14,
            background:todayRec?.checkIn?"rgba(255,255,255,0.1)":"linear-gradient(135deg,#1a6b3a,#2d9e5e)",
            color:todayRec?.checkIn?"#888":"#fff",
            opacity:todayRec?.checkIn?0.6:1}}>
          {todayRec?.checkIn?"✅ تم الحضور":"👆 تسجيل الحضور"}
          {todayRec?.checkIn&&<div style={{fontSize:11,marginTop:3,fontWeight:400}}>{todayRec.checkIn}</div>}
        </button>

        {/* زر بصمة التواجد */}
        <button onClick={handlePresenceStamp} disabled={!todayRec||!!todayRec?.presenceStamp}
          style={{padding:"14px 10px",borderRadius:10,border:"none",cursor:(!todayRec||todayRec?.presenceStamp)?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14,
            background:todayRec?.presenceStamp?"rgba(255,255,255,0.1)":!todayRec?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#b8860b,#d4a017)",
            color:todayRec?.presenceStamp?"#888":!todayRec?"#555":"#fff",
            opacity:(!todayRec||todayRec?.presenceStamp)?0.6:1}}>
          {todayRec?.presenceStamp?"🔔 تم التواجد":"🔔 بصمة التواجد"}
          {todayRec?.presenceStamp&&<div style={{fontSize:11,marginTop:3,fontWeight:400}}>{todayRec.presenceStamp}</div>}
          {!todayRec?.presenceStamp&&<div style={{fontSize:10,marginTop:3,fontWeight:400,color:todayRec?"#fff3cd":"#555"}}>9:31 - 10:30</div>}
        </button>

        {/* زر الانصراف */}
        <button onClick={handleCheckOut} disabled={!todayRec||!!todayRec?.checkOut}
          style={{padding:"14px 10px",borderRadius:10,border:"none",cursor:(!todayRec||todayRec?.checkOut)?"not-allowed":"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14,
            background:todayRec?.checkOut?"rgba(255,255,255,0.1)":!todayRec?"rgba(255,255,255,0.05)":"linear-gradient(135deg,#721c24,#c0392b)",
            color:todayRec?.checkOut?"#888":!todayRec?"#555":"#fff",
            opacity:(!todayRec||todayRec?.checkOut)?0.6:1}}>
          {todayRec?.checkOut?"🚪 تم الانصراف":"🚪 تسجيل الانصراف"}
          {todayRec?.checkOut&&<div style={{fontSize:11,marginTop:3,fontWeight:400}}>{todayRec.checkOut}</div>}
        </button>
      </div>
    </div>

    {alerts.length>0&&<div style={{marginBottom:20}}>{alerts.map((a,i)=><div key={i} style={{background:a.t==="danger"?"#f8d7da":"#fff3cd",color:a.t==="danger"?"#721c24":"#856404",padding:"10px 16px",borderRadius:8,marginBottom:8,fontSize:13,fontWeight:600}}>{a.t==="danger"?"🚫":"⚠️"} {a.msg}</div>)}</div>}

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
      <div style={{background:"#fff",borderRadius:12,padding:20,border:"1.5px solid #e0e8f4"}}>
        <h3 style={{color:"#0a2d5e",fontSize:15,fontWeight:700,margin:"0 0 14px",borderBottom:"2px solid #d4a017",paddingBottom:8}}>📋 بياناتي</h3>
        {[["الاسم",emp.name],["الرقم الوظيفي",emp.employeeNo],["الوحدة",emp.unit||emp.title],["اسم المستخدم",u?.username]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f0f4fa",fontSize:13}}>
            <span style={{color:"#888"}}>{k}</span><span style={{fontWeight:600,color:"#333"}}>{v||"—"}</span>
          </div>
        ))}
        <div style={{marginTop:10}}><Badge status={emp.status} map={empSMap}/></div>
      </div>
      <div style={{background:"#fff",borderRadius:12,padding:20,border:"1.5px solid #e0e8f4"}}>
        <h3 style={{color:"#0a2d5e",fontSize:15,fontWeight:700,margin:"0 0 14px",borderBottom:"2px solid #d4a017",paddingBottom:8}}>📊 رصيدي</h3>
        <LimitBar label="⏰ التأخير (هذا الشهر)" used={s.lateMin} max={LIMITS.lateMinutesPerMonth} color="#1a4a8a"/>
        <LimitBar label="📝 الاستئذانات (هذا الشهر)" used={s.permMonth} max={LIMITS.permissionsPerMonth} color="#5a3878"/>
        <div style={{borderTop:"1px solid #f0f4fa",paddingTop:14,marginTop:4}}>
          <h4 style={{color:"#0a2d5e",fontSize:13,fontWeight:700,margin:"0 0 10px"}}>رصيد السنة</h4>
          <LimitBar label="🏥 إجازة مرضية" used={s.sickYear} max={LIMITS.sickLeavesPerYear} color="#856404"/>
          <LimitBar label="🚨 إجازة طارئة (الشهر)" used={s.emergMonth} max={LIMITS.emergencyLeavesPerMonth} color="#c0392b"/>
        </div>
      </div>
    </div>

    <div style={{background:"#fff",borderRadius:12,padding:20,border:"1.5px solid #e0e8f4"}}>
      <h3 style={{color:"#0a2d5e",fontSize:15,fontWeight:700,margin:"0 0 14px"}}>📅 آخر سجلات حضوري</h3>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>{["التاريخ","الحضور","الانصراف المقرر","الانصراف الفعلي","التأخير","بصمة التواجد","الحالة"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"right"}}>{h}</th>)}</tr></thead>
        <tbody>{db.attendance.filter(a=>a.employeeId===user.employeeId).slice(-10).reverse().map((r,i)=>{
          const lm=r.checkIn?calcLateMinutes(r.checkIn):0;
          const eco=r.checkIn?getExpectedCheckout(r.checkIn):null;
          return(<tr key={r.id} style={{background:i%2===0?"#f8faff":"#fff"}}>
            <td style={{padding:"9px 12px"}}>{r.date}</td>
            <td style={{padding:"9px 12px"}}>{r.checkIn||"-"}</td>
            <td style={{padding:"9px 12px",color:"#555",fontStyle:"italic"}}>{eco||"-"}</td>
            <td style={{padding:"9px 12px"}}>{r.checkOut||"-"}</td>
            <td style={{padding:"9px 12px"}}>{lm>0?<span style={{background:"#fff3cd",color:"#856404",padding:"2px 8px",borderRadius:20,fontSize:11}}>{lm}د</span>:"—"}</td>
            <td style={{padding:"9px 12px"}}>{r.presenceStamp?<span style={{background:isInPresenceWindow(r.presenceStamp)?"#d4edda":"#f0f4fa",color:isInPresenceWindow(r.presenceStamp)?"#1a6b3a":"#555",padding:"2px 8px",borderRadius:20,fontSize:11}}>{r.presenceStamp}{isInPresenceWindow(r.presenceStamp)?" 🔔":""}</span>:"-"}</td>
            <td style={{padding:"9px 12px"}}><Badge status={r.status} map={statusMap}/></td>
          </tr>);
        })}</tbody>
      </table>
    </div>
  </div>);
}

// ===== EMPLOYEES PAGE =====
function EmployeesPage({db,persist,cy,cm}){
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const openAdd=()=>{setForm({name:"",employeeNo:"",title:"",phone:"",email:"",status:"active"});setModal("add");};
  const openEdit=(e)=>{setForm({...e});setModal("edit");};
  const save=()=>{
    if(!form.name||!form.employeeNo)return alert("يرجى ملء الحقول المطلوبة");
    const nDB={...db};
    if(modal==="add"){const nid=Math.max(...db.employees.map(e=>e.id),0)+1;nDB.employees=[...db.employees,{...form,id:nid}];}
    else nDB.employees=db.employees.map(e=>e.id===form.id?form:e);
    persist(nDB);setModal(null);
  };
  const del=(id)=>{if(!confirm("حذف؟"))return;persist({...db,employees:db.employees.filter(e=>e.id!==id)});};
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <h2 style={{margin:0,color:"#0a2d5e",fontSize:20,fontWeight:800}}>👥 إدارة الموظفات</h2>
      <button style={bP} onClick={openAdd}>+ إضافة موظفة</button>
    </div>
    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>{["الاسم","الرقم الوظيفي","المسمى","الحالة","تأخير/شهر","استئذانات","إجراءات"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:"right"}}>{h}</th>)}</tr></thead>
        <tbody>{db.employees.map((emp,i)=>{
          const s=calcStats(emp.id,db,cy,cm);
          return(<tr key={emp.id} style={{background:i%2===0?"#f8faff":"#fff"}}>
            <td style={{padding:"12px 14px",fontWeight:600,color:"#0a2d5e"}}>{emp.name}</td>
            <td style={{padding:"12px 14px"}}>{emp.employeeNo}</td>
            <td style={{padding:"12px 14px"}}>{emp.title}</td>
            <td style={{padding:"12px 14px"}}><Badge status={emp.status} map={empSMap}/></td>
            <td style={{padding:"12px 14px",color:s.lateOver?"#c0392b":"#555",fontWeight:s.lateOver?700:400}}>{s.lateMin}د {s.lateOver?"⚠️":""}</td>
            <td style={{padding:"12px 14px",color:s.permOver?"#c0392b":"#555",fontWeight:s.permOver?700:400}}>{s.permMonth}/{LIMITS.permissionsPerMonth}{s.permOver?" ⚠️":""}</td>
            <td style={{padding:"12px 14px"}}><div style={{display:"flex",gap:6}}><button style={bGold} onClick={()=>openEdit(emp)}>تعديل</button><button style={bRed} onClick={()=>del(emp.id)}>حذف</button></div></td>
          </tr>);
        })}</tbody>
      </table>
    </div>
    {modal&&(<Modal title={modal==="add"?"إضافة موظفة":"تعديل بيانات"} onClose={()=>setModal(null)}>
      <FF label="الاسم الكامل" required><input style={iS} value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})}/></FF>
      <FF label="الرقم الوظيفي" required><input style={iS} value={form.employeeNo||""} onChange={e=>setForm({...form,employeeNo:e.target.value})}/></FF>
      <FF label="المسمى الوظيفي"><input style={iS} value={form.title||""} onChange={e=>setForm({...form,title:e.target.value})}/></FF>
      <FF label="رقم الهاتف"><input style={iS} value={form.phone||""} onChange={e=>setForm({...form,phone:e.target.value})}/></FF>
      <FF label="البريد الإلكتروني"><input style={iS} value={form.email||""} onChange={e=>setForm({...form,email:e.target.value})}/></FF>
      <FF label="الحالة"><select style={sS} value={form.status||"active"} onChange={e=>setForm({...form,status:e.target.value})}><option value="active">نشطة</option><option value="leave">في إجازة</option><option value="transferred">منقولة</option><option value="suspended">موقوفة</option></select></FF>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><button style={bS} onClick={()=>setModal(null)}>إلغاء</button><button style={bP} onClick={save}>💾 حفظ</button></div>
    </Modal>)}
  </div>);
}

// ===== ACCOUNTS PAGE =====
function AccountsPage({db,persist}){
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [sp,setSP]=useState({});
  const openAdd=()=>{setForm({username:"",password:"",role:"employee",employeeId:"",name:""});setModal("add");};
  const openEdit=(u)=>{setForm({...u});setModal("edit");};
  const save=()=>{
    if(!form.username||!form.password)return alert("يرجى ملء الحقول");
    if(db.users.find(u=>u.username===form.username&&u.id!==form.id))return alert("اسم المستخدم مستخدم");
    const nDB={...db};
    if(modal==="add"){const nid=Math.max(...db.users.map(u=>u.id),0)+1;nDB.users=[...db.users,{...form,id:nid,employeeId:form.employeeId?parseInt(form.employeeId):null}];}
    else nDB.users=db.users.map(u=>u.id===form.id?{...form,employeeId:form.employeeId?parseInt(form.employeeId):null}:u);
    persist(nDB);setModal(null);
  };
  const del=(id)=>{if(db.users.find(u=>u.id===id)?.role==="admin")return alert("لا يمكن حذف المسؤول");if(!confirm("حذف؟"))return;persist({...db,users:db.users.filter(u=>u.id!==id)});};
  const resetPass=(id)=>{const p="Pass@"+Math.random().toString(36).slice(2,8).toUpperCase();persist({...db,users:db.users.map(u=>u.id===id?{...u,password:p}:u)});alert(`كلمة المرور الجديدة: ${p}`);};
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <h2 style={{margin:0,color:"#0a2d5e",fontSize:20,fontWeight:800}}>🔑 إدارة الحسابات</h2>
      <button style={bP} onClick={openAdd}>+ إضافة حساب</button>
    </div>
    <div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>{["الاسم","الرتبة","اسم المستخدم","كلمة المرور","الصلاحية","الموظفة","إجراءات"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:"right"}}>{h}</th>)}</tr></thead>
        <tbody>{db.users.map((u,i)=>{
          const emp=db.employees.find(e=>e.id===u.employeeId);
          return(<tr key={u.id} style={{background:i%2===0?"#f8faff":"#fff"}}>
            <td style={{padding:"12px 14px",fontWeight:600,color:"#0a2d5e"}}>{u.name}</td>
            <td style={{padding:"12px 14px",color:"#856404",fontWeight:600,fontSize:12}}>{u.rank||"—"}</td>
            <td style={{padding:"12px 14px"}}><span style={{background:"#e8f0fa",color:"#0a2d5e",padding:"3px 10px",borderRadius:6,fontFamily:"monospace",fontWeight:700}}>{u.username}</span></td>
            <td style={{padding:"12px 14px"}}><span style={{fontFamily:"monospace",color:"#555",fontSize:12}}>{sp[u.id]?u.password:"••••••••"}</span><button onClick={()=>setSP(p=>({...p,[u.id]:!p[u.id]}))} style={{marginRight:6,background:"none",border:"none",cursor:"pointer",color:"#1a4a8a",fontSize:11,fontFamily:"inherit"}}>{sp[u.id]?"إخفاء":"إظهار"}</button></td>
            <td style={{padding:"12px 14px"}}><span style={{background:u.role==="admin"?"#e8f0fa":"#d4edda",color:u.role==="admin"?"#0a2d5e":"#1a6b3a",padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:600}}>{u.role==="admin"?"مسؤول":"موظفة"}</span></td>
            <td style={{padding:"12px 14px",color:"#555"}}>{emp?.name||(u.role==="admin"?"—":"غير مرتبط")}</td>
            <td style={{padding:"12px 14px"}}><div style={{display:"flex",gap:5,flexWrap:"wrap"}}><button style={bGold} onClick={()=>openEdit(u)}>تعديل</button><button style={{...bSm,background:"linear-gradient(135deg,#5a3878,#7d4fa3)"}} onClick={()=>resetPass(u.id)}>إعادة كلمة المرور</button>{u.role!=="admin"&&<button style={bRed} onClick={()=>del(u.id)}>حذف</button>}</div></td>
          </tr>);
        })}</tbody>
      </table>
    </div>
    {modal&&(<Modal title={modal==="add"?"إضافة حساب":"تعديل الحساب"} onClose={()=>setModal(null)}>
      <FF label="الاسم" required><input style={iS} value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})}/></FF>
      <FF label="اسم المستخدم" required><input style={iS} value={form.username||""} onChange={e=>setForm({...form,username:e.target.value})}/></FF>
      <FF label="كلمة المرور" required><input style={iS} value={form.password||""} onChange={e=>setForm({...form,password:e.target.value})}/></FF>
      <FF label="الرتبة / الدرجة"><input style={iS} value={form.rank||""} onChange={e=>setForm({...form,rank:e.target.value})} placeholder="مثال: عقيد / ملازم أول / —"/></FF>
      <FF label="الصلاحية"><select style={sS} value={form.role||"employee"} onChange={e=>setForm({...form,role:e.target.value})}><option value="employee">موظفة</option><option value="admin">مسؤول (صلاحيات كاملة)</option></select></FF>
      {form.role!=="admin"&&<FF label="الموظفة المرتبطة"><select style={sS} value={form.employeeId||""} onChange={e=>setForm({...form,employeeId:e.target.value})}><option value="">— اختر —</option>{db.employees.map(e=><option key={e.id} value={e.id}>{e.name} ({e.employeeNo})</option>)}</select></FF>}
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><button style={bS} onClick={()=>setModal(null)}>إلغاء</button><button style={bP} onClick={save}>💾 حفظ</button></div>
    </Modal>)}
  </div>);
}

// ===== REPORTS PAGE =====
function ReportsPage({db,cy,cm}){
  const [rt,setRT]=useState("daily");
  const [fe,setFE]=useState("all");
  const [fd,setFD]=useState(new Date().toISOString().split("T")[0]);
  const [fm,setFM]=useState(new Date().toISOString().slice(0,7));

  const getRecs=()=>{
    let r=db.attendance;
    if(fe!=="all")r=r.filter(x=>x.employeeId===parseInt(fe));
    if(rt==="daily")r=r.filter(x=>x.date===fd);
    if(rt==="monthly")r=r.filter(x=>x.date.startsWith(fm));
    return r;
  };
  const recs=getRecs();
  const st={p:recs.filter(r=>r.status==="present").length,l:recs.filter(r=>r.status==="late").length,a:recs.filter(r=>r.status==="absent").length,lv:recs.filter(r=>r.status==="leave").length};

  const exportCSV=()=>{
    const h=["الموظفة","التاريخ","الحضور","الانصراف المقرر","الانصراف الفعلي","التأخير(د)","بصمة التواجد","الحالة"];
    const rows=recs.map(r=>{const emp=db.employees.find(e=>e.id===r.employeeId);const lm=r.checkIn?calcLateMinutes(r.checkIn):0;const eco=r.checkIn?getExpectedCheckout(r.checkIn):"";return[emp?.name,r.date,r.checkIn,eco,r.checkOut,lm,r.presenceStamp,statusMap[r.status]?.label].join(",");});
    const csv="\uFEFF"+[h.join(","),...rows].join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));a.download="تقرير.csv";a.click();
  };

  return(<div>
    <h2 style={{color:"#0a2d5e",fontSize:20,fontWeight:800,marginBottom:20}}>📈 التقارير</h2>
    <div style={{background:"#fff",borderRadius:12,padding:20,marginBottom:20,border:"1.5px solid #e0e8f4"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
        <FF label="نوع التقرير"><select style={sS} value={rt} onChange={e=>setRT(e.target.value)}><option value="daily">يومي</option><option value="monthly">شهري</option><option value="employee">موظفة</option><option value="limits">الرصيد والحدود</option><option value="late">التأخير</option><option value="leaves">الإجازات</option><option value="permissions">الاستئذانات</option></select></FF>
        {(rt==="daily"||rt==="employee")&&<FF label="التاريخ"><input type="date" style={iS} value={fd} onChange={e=>setFD(e.target.value)}/></FF>}
        {rt==="monthly"&&<FF label="الشهر"><input type="month" style={iS} value={fm} onChange={e=>setFM(e.target.value)}/></FF>}
        {(rt==="employee"||rt==="daily")&&<FF label="الموظفة"><select style={sS} value={fe} onChange={e=>setFE(e.target.value)}><option value="all">الكل</option>{db.employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></FF>}
      </div>
      <div style={{display:"flex",gap:10,marginTop:8}}>
        <button style={bP} onClick={exportCSV}>📥 تصدير Excel</button>
        <button style={bS} onClick={()=>window.print()}>🖨️ طباعة</button>
      </div>
    </div>

    {(rt==="daily"||rt==="monthly"||rt==="employee")&&(<>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[{l:"حضور",v:st.p,c:"#1a6b3a",bg:"#d4edda"},{l:"متأخرات",v:st.l,c:"#856404",bg:"#fff3cd"},{l:"غياب",v:st.a,c:"#721c24",bg:"#f8d7da"},{l:"إجازة",v:st.lv,c:"#004085",bg:"#cce5ff"}].map((s,i)=>(
          <div key={i} style={{background:s.bg,borderRadius:10,padding:14,textAlign:"center"}}><div style={{fontSize:24,fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:12,color:s.c,fontWeight:600,marginTop:4}}>{s.l}</div></div>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>{["الموظفة","التاريخ","الحضور","الانصراف المقرر","الانصراف الفعلي","التأخير","بصمة التواجد","الحالة"].map(h=><th key={h} style={{padding:"10px 12px",textAlign:"right"}}>{h}</th>)}</tr></thead>
          <tbody>{recs.map((r,i)=>{const emp=db.employees.find(e=>e.id===r.employeeId);const lm=r.checkIn?calcLateMinutes(r.checkIn):0;const eco=r.checkIn?getExpectedCheckout(r.checkIn):null;return(<tr key={r.id} style={{background:i%2===0?"#f8faff":"#fff"}}>
            <td style={{padding:"9px 12px",fontWeight:600,color:"#0a2d5e"}}>{emp?.name}</td>
            <td style={{padding:"9px 12px"}}>{r.date}</td>
            <td style={{padding:"9px 12px"}}>{r.checkIn||"-"}</td>
            <td style={{padding:"9px 12px",fontStyle:"italic",color:"#555"}}>{eco||"-"}</td>
            <td style={{padding:"9px 12px"}}>{r.checkOut||"-"}</td>
            <td style={{padding:"9px 12px"}}>{lm>0?<span style={{background:"#fff3cd",color:"#856404",padding:"2px 8px",borderRadius:20,fontSize:11}}>{lm}د</span>:"—"}</td>
            <td style={{padding:"9px 12px"}}>{r.presenceStamp||"-"}</td>
            <td style={{padding:"9px 12px"}}><Badge status={r.status} map={statusMap}/></td>
          </tr>);})}
          </tbody>
        </table>
      </div>
    </>)}

    {rt==="limits"&&(
      <div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>{["الموظفة","تأخير/شهر","استئذانات/شهر","إجازة مرضية/سنة","إجازة طارئة/شهر","الحالة"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:"right"}}>{h}</th>)}</tr></thead>
          <tbody>{db.employees.map((emp,i)=>{const s=calcStats(emp.id,db,cy,cm);const ok=!s.lateOver&&!s.permOver&&!s.sickOver&&!s.emergOver;return(
            <tr key={emp.id} style={{background:!ok?"#fff8f0":i%2===0?"#f8faff":"#fff"}}>
              <td style={{padding:"10px 14px",fontWeight:600,color:"#0a2d5e"}}>{emp.name}</td>
              <td style={{padding:"10px 14px",color:s.lateOver?"#c0392b":"#333",fontWeight:s.lateOver?700:400}}>{s.lateMin}/{LIMITS.lateMinutesPerMonth}د{s.lateOver?" ⚠️":""}</td>
              <td style={{padding:"10px 14px",color:s.permOver?"#c0392b":"#333",fontWeight:s.permOver?700:400}}>{s.permMonth}/{LIMITS.permissionsPerMonth}{s.permOver?" ⚠️":""}</td>
              <td style={{padding:"10px 14px",color:s.sickOver?"#c0392b":"#333",fontWeight:s.sickOver?700:400}}>{s.sickYear}/{LIMITS.sickLeavesPerYear}{s.sickOver?" ⚠️":""}</td>
              <td style={{padding:"10px 14px",color:s.emergOver?"#c0392b":"#333",fontWeight:s.emergOver?700:400}}>{s.emergMonth}/{LIMITS.emergencyLeavesPerMonth}{s.emergOver?" ⚠️":""}</td>
              <td style={{padding:"10px 14px"}}>{ok?<span style={{background:"#d4edda",color:"#1a6b3a",padding:"3px 10px",borderRadius:20,fontSize:12}}>✓ ضمن الحدود</span>:<span style={{background:"#f8d7da",color:"#721c24",padding:"3px 10px",borderRadius:20,fontSize:12}}>⚠️ تجاوز</span>}</td>
            </tr>
          );})}
          </tbody>
        </table>
      </div>
    )}
    {rt==="late"&&<div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>{["الموظفة","التاريخ","التأخير","السبب","الاعتماد"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:"right"}}>{h}</th>)}</tr></thead><tbody>{db.lateRecords.map((r,i)=>{const emp=db.employees.find(e=>e.id===r.employeeId);return(<tr key={r.id} style={{background:i%2===0?"#f8faff":"#fff"}}><td style={{padding:"10px 14px",fontWeight:600,color:"#0a2d5e"}}>{emp?.name}</td><td style={{padding:"10px 14px"}}>{r.date}</td><td style={{padding:"10px 14px"}}><span style={{background:"#fff3cd",color:"#856404",padding:"3px 10px",borderRadius:20,fontSize:12}}>{r.duration}د</span></td><td style={{padding:"10px 14px"}}>{r.reason||"-"}</td><td style={{padding:"10px 14px"}}>{r.approved?"✅":"⏳"}</td></tr>);})}</tbody></table></div>}
    {rt==="leaves"&&<div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>{["الموظفة","التاريخ","النوع","السبب"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:"right"}}>{h}</th>)}</tr></thead><tbody>{db.leaves.map((l,i)=>{const emp=db.employees.find(e=>e.id===l.employeeId);return(<tr key={l.id} style={{background:i%2===0?"#f8faff":"#fff"}}><td style={{padding:"10px 14px",fontWeight:600,color:"#0a2d5e"}}>{emp?.name}</td><td style={{padding:"10px 14px"}}>{l.date}</td><td style={{padding:"10px 14px"}}>{leaveMap[l.type]}</td><td style={{padding:"10px 14px"}}>{l.reason||"-"}</td></tr>);})}</tbody></table></div>}
    {rt==="permissions"&&<div style={{background:"#fff",borderRadius:12,overflow:"hidden",border:"1.5px solid #e0e8f4"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"linear-gradient(135deg,#0a2d5e,#1a4a8a)",color:"#fff"}}>{["الموظفة","التاريخ","الخروج","العودة","السبب","الحالة"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:"right"}}>{h}</th>)}</tr></thead><tbody>{db.permissions.map((p,i)=>{const emp=db.employees.find(e=>e.id===p.employeeId);return(<tr key={p.id} style={{background:i%2===0?"#f8faff":"#fff"}}><td style={{padding:"10px 14px",fontWeight:600,color:"#0a2d5e"}}>{emp?.name}</td><td style={{padding:"10px 14px"}}>{p.date}</td><td style={{padding:"10px 14px"}}>{p.exitTime}</td><td style={{padding:"10px 14px"}}>{p.returnTime}</td><td style={{padding:"10px 14px"}}>{p.reason}</td><td style={{padding:"10px 14px"}}><Badge status={p.status} map={permSMap}/></td></tr>);})}</tbody></table></div>}
  </div>);
}


// ===== MESSAGES PAGE =====
function MessagesPage({db,persist}){
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  const [sendTo,setSendTo]=useState("all"); // all | select
  const [selected,setSelected]=useState([]);
  const [channel,setChannel]=useState({email:true,sms:true});
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);
  const [history,setHistory]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("moi_msg_history")||"[]");}catch{return [];}
  });

  const employees=db.employees.filter(e=>e.status==="active");

  const getTargets=()=>{
    if(sendTo==="all") return employees;
    return employees.filter(e=>selected.includes(e.id));
  };

  const toggleSelect=(id)=>{
    setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  };

  const selectAll=()=>setSelected(employees.map(e=>e.id));
  const clearAll=()=>setSelected([]);

  // فتح تطبيق الإيميل الافتراضي
  const openEmailClient=(emails,subj,msg)=>{
    const to=emails.join(",");
    const subject=encodeURIComponent(subj);
    const bodyEnc=encodeURIComponent(msg);
    window.open(`mailto:${to}?subject=${subject}&body=${bodyEnc}`,"_blank");
  };

  // فتح تطبيق الرسائل / واتساب
  const openSMSClient=(phones,msg)=>{
    const msgEnc=encodeURIComponent(msg);
    // واتساب ويب للرسائل الجماعية
    if(phones.length===1){
      const ph=phones[0].replace(/\D/g,"");
      window.open(`https://wa.me/${ph}?text=${msgEnc}`,"_blank");
    } else {
      // فتح تطبيق الرسائل مع أول رقم (القيد التقني للمتصفح)
      const ph=phones[0].replace(/\D/g,"");
      window.open(`sms:${phones.join(",")}?body=${decodeURIComponent(msgEnc)}`,"_blank");
    }
  };

  const handleSend=()=>{
    const targets=getTargets();
    if(!title.trim()||!body.trim()){alert("يرجى كتابة عنوان ونص الرسالة");return;}
    if(targets.length===0){alert("يرجى اختيار موظفة واحدة على الأقل");return;}
    if(!channel.email&&!channel.sms){alert("يرجى اختيار قناة إرسال واحدة على الأقل");return;}

    setSending(true);

    const fullMsg=title+" - "+body+" - قسم المعلومات والاحصاء - وزارة الداخلية";
    const emails=targets.map(e=>e.email).filter(Boolean);
    const phones=targets.map(e=>e.phone).filter(Boolean);

    let sentChannels=[];

    if(channel.email && emails.length>0){
      openEmailClient(emails,title,fullMsg);
      sentChannels.push(`إيميل (${emails.length} موظفة)`);
    }

    if(channel.sms && phones.length>0){
      setTimeout(()=>openSMSClient(phones,fullMsg),800);
      sentChannels.push(`جوال (${phones.length} موظفة)`);
    }

    // حفظ في السجل
    const newMsg={
      id:Date.now(),
      date:new Date().toLocaleString("ar-KW"),
      title,
      body,
      targets:targets.map(e=>e.name),
      channels:sentChannels,
      sentBy:"رئيس القسم"
    };
    const newHistory=[newMsg,...history].slice(0,50);
    setHistory(newHistory);
    localStorage.setItem("moi_msg_history",JSON.stringify(newHistory));

    setSending(false);
    setSent(true);
    setTimeout(()=>setSent(false),4000);

    if(sentChannels.length>0){
      alert("تم فتح تطبيقات الارسال - عدد المستقبلين: "+targets.length+" موظفة");
    } else {
      alert("لا تتوفر بيانات اتصال للموظفات - يرجى تحديث بياناتهن من صفحة الموظفات");
    }
  };

  const clearHistory=()=>{
    if(!confirm("مسح سجل الرسائل؟"))return;
    setHistory([]);
    localStorage.removeItem("moi_msg_history");
  };

  return(<div>
    <h2 style={{color:"#0a2d5e",fontSize:20,fontWeight:800,marginBottom:20}}>📨 الرسائل الجماعية</h2>

    <div style={{display:"grid",gridTemplateColumns:"1.3fr 0.7fr",gap:20}}>

      {/* === نموذج الإرسال === */}
      <div>
        <div style={{background:"#fff",borderRadius:12,padding:24,border:"1.5px solid #e0e8f4",marginBottom:20}}>
          <h3 style={{color:"#0a2d5e",fontSize:15,fontWeight:700,margin:"0 0 18px",borderBottom:"2px solid #d4a017",paddingBottom:10}}>✏️ إنشاء رسالة جديدة</h3>

          <FF label="عنوان الرسالة" required>
            <input style={iS} value={title} onChange={e=>setTitle(e.target.value)} placeholder="مثال: تذكير بموعد الاجتماع"/>
          </FF>

          <FF label="نص الرسالة" required>
            <textarea style={{...iS,height:120,resize:"vertical"}} value={body} onChange={e=>setBody(e.target.value)} placeholder="اكتب نص الرسالة هنا..."/>
          </FF>

          {/* معاينة الرسالة */}
          {(title||body)&&(
            <div style={{background:"#f8faff",border:"1.5px dashed #c8d4e8",borderRadius:10,padding:14,marginBottom:16}}>
              <div style={{fontSize:11,color:"#888",marginBottom:6}}>📋 معاينة الرسالة:</div>
              <div style={{fontSize:13,color:"#0a2d5e",fontWeight:700}}>{title}</div>
              <div style={{fontSize:13,color:"#444",marginTop:6,whiteSpace:"pre-wrap"}}>{body}</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:8,borderTop:"1px solid #e0e8f4",paddingTop:6}}>قسم المعلومات والإحصاء - وزارة الداخلية</div>
            </div>
          )}

          {/* قنوات الإرسال */}
          <FF label="قنوات الإرسال">
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:600,color:channel.email?"#0a2d5e":"#888"}}>
                <input type="checkbox" checked={channel.email} onChange={e=>setChannel({...channel,email:e.target.checked})}
                  style={{width:16,height:16,cursor:"pointer"}}/>
                <span style={{fontSize:18}}>📧</span> إيميل
              </label>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:14,fontWeight:600,color:channel.sms?"#0a2d5e":"#888"}}>
                <input type="checkbox" checked={channel.sms} onChange={e=>setChannel({...channel,sms:e.target.checked})}
                  style={{width:16,height:16,cursor:"pointer"}}/>
                <span style={{fontSize:18}}>📱</span> رسالة جوال / واتساب
              </label>
            </div>
          </FF>

          {/* المستقبلون */}
          <FF label="المستقبلون">
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <button onClick={()=>setSendTo("all")}
                style={{...bSm,background:sendTo==="all"?"linear-gradient(135deg,#0a2d5e,#1a4a8a)":"#f0f4fa",color:sendTo==="all"?"#fff":"#0a2d5e",border:sendTo==="all"?"none":"1.5px solid #c8d4e8"}}>
                👥 جميع الموظفات ({employees.length})
              </button>
              <button onClick={()=>setSendTo("select")}
                style={{...bSm,background:sendTo==="select"?"linear-gradient(135deg,#0a2d5e,#1a4a8a)":"#f0f4fa",color:sendTo==="select"?"#fff":"#0a2d5e",border:sendTo==="select"?"none":"1.5px solid #c8d4e8"}}>
                ✅ اختيار محدد
              </button>
            </div>

            {sendTo==="select"&&(
              <div style={{border:"1.5px solid #e0e8f4",borderRadius:10,overflow:"hidden"}}>
                <div style={{background:"#f0f4fa",padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:"#555"}}>اختر الموظفات ({selected.length} مختارة)</span>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={selectAll} style={{...bSm,padding:"4px 10px",fontSize:11}}>تحديد الكل</button>
                    <button onClick={clearAll} style={{...bSm,padding:"4px 10px",fontSize:11,background:"#f0f4fa",color:"#555",border:"1px solid #ccc"}}>إلغاء الكل</button>
                  </div>
                </div>
                {employees.map(emp=>{
                  const hasEmail=!!emp.email;
                  const hasPhone=!!emp.phone;
                  return(
                    <label key={emp.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:"1px solid #f0f4fa",cursor:"pointer",background:selected.includes(emp.id)?"#e8f0fa":"#fff"}}>
                      <input type="checkbox" checked={selected.includes(emp.id)} onChange={()=>toggleSelect(emp.id)} style={{width:16,height:16}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:"#0a2d5e"}}>{emp.name}</div>
                        <div style={{fontSize:11,color:"#888",display:"flex",gap:10,marginTop:2}}>
                          <span style={{color:hasEmail?"#1a6b3a":"#ccc"}}>{hasEmail?"📧 "+emp.email:"📧 لا يوجد إيميل"}</span>
                          <span style={{color:hasPhone?"#1a4a8a":"#ccc"}}>{hasPhone?"📱 "+emp.phone:"📱 لا يوجد جوال"}</span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </FF>

          {/* زر الإرسال */}
          <div style={{marginTop:8}}>
            {sent&&(
              <div style={{background:"#d4edda",color:"#1a6b3a",padding:"10px 16px",borderRadius:8,marginBottom:12,fontSize:13,fontWeight:700,textAlign:"center"}}>
                ✅ تم فتح تطبيقات الإرسال بنجاح!
              </div>
            )}
            <button onClick={handleSend} disabled={sending}
              style={{...bP,width:"100%",padding:14,fontSize:15,opacity:sending?0.7:1}}>
              {sending?"⏳ جاري الإرسال...":"📤 إرسال الرسالة"}
            </button>

            <div style={{background:"#fff3cd",borderRadius:8,padding:"10px 14px",marginTop:12,fontSize:12,color:"#856404"}}>
              <strong>ℹ️ ملاحظة:</strong> سيفتح النظام تطبيق الإيميل والرسائل تلقائياً مع الرسالة جاهزة للإرسال.
              لإرسال الرسائل تلقائياً بدون فتح التطبيقات، يحتاج ربط النظام بخدمة SMTP أو SMS API.
            </div>
          </div>
        </div>
      </div>

      {/* === الإحصائيات وسجل الرسائل === */}
      <div>
        {/* إحصائيات بيانات الاتصال */}
        <div style={{background:"#fff",borderRadius:12,padding:20,border:"1.5px solid #e0e8f4",marginBottom:16}}>
          <h3 style={{color:"#0a2d5e",fontSize:14,fontWeight:700,margin:"0 0 14px"}}>📊 بيانات الاتصال</h3>
          {[
            {l:"إيميل متوفر",v:employees.filter(e=>e.email).length,t:employees.length,c:"#1a6b3a",bg:"#d4edda",i:"📧"},
            {l:"جوال متوفر", v:employees.filter(e=>e.phone).length,t:employees.length,c:"#1a4a8a",bg:"#cce5ff",i:"📱"},
            {l:"كلاهما متوفر",v:employees.filter(e=>e.email&&e.phone).length,t:employees.length,c:"#856404",bg:"#fff3cd",i:"✅"},
          ].map((x,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f0f4fa"}}>
              <span style={{fontSize:13,color:"#555"}}>{x.i} {x.l}</span>
              <span style={{background:x.bg,color:x.c,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:700}}>{x.v}/{x.t}</span>
            </div>
          ))}
          {employees.some(e=>!e.email||!e.phone)&&(
            <div style={{background:"#fff3cd",borderRadius:8,padding:"8px 10px",marginTop:10,fontSize:11,color:"#856404"}}>
              ⚠️ بعض الموظفات لا تملك بيانات اتصال كاملة. يمكن تحديثها من صفحة الموظفات.
            </div>
          )}
        </div>

        {/* سجل الرسائل */}
        <div style={{background:"#fff",borderRadius:12,padding:20,border:"1.5px solid #e0e8f4"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{color:"#0a2d5e",fontSize:14,fontWeight:700,margin:0}}>📋 سجل الرسائل</h3>
            {history.length>0&&<button onClick={clearHistory} style={{...bRed,padding:"4px 10px",fontSize:11}}>مسح</button>}
          </div>
          {history.length===0?(
            <div style={{textAlign:"center",color:"#aaa",fontSize:13,padding:"20px 0"}}>لا توجد رسائل مرسلة بعد</div>
          ):(
            <div style={{maxHeight:400,overflowY:"auto"}}>
              {history.map(m=>(
                <div key={m.id} style={{padding:"12px 0",borderBottom:"1px solid #f0f4fa"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:700,color:"#0a2d5e"}}>{m.title}</span>
                    <span style={{fontSize:11,color:"#aaa"}}>{m.date}</span>
                  </div>
                  <div style={{fontSize:12,color:"#555",marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.body}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    <span style={{background:"#e8f0fa",color:"#0a2d5e",padding:"2px 8px",borderRadius:20,fontSize:11}}>
                      👥 {m.targets.length} موظفة
                    </span>
                    {m.channels.map((ch,i)=>(
                      <span key={i} style={{background:"#d4edda",color:"#1a6b3a",padding:"2px 8px",borderRadius:20,fontSize:11}}>{ch}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>);
}