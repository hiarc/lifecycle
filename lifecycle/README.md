# 「睡眠・覚醒リズム表」Webフォーム

## 起動

* ダウンロードしたlifecycle-master.zipを解凍します。
* 解凍したフォルダ中の **licecycle.bat** ファイルを **右クリック > 「編集」** します。
* 2行目を **lifecycle.bat と同じフォルダのパス** に書き換えます。

変更例（Windows）：

![](./img/c5.PNG)

* ファイルを上書き保存し、 lifecycle.bat を閉じます。
* エクスプローラーから **lifecycle.bat** をダブルクリックし、batファイルを実行します。
* コマンドプロンプトとブラウザが立ち上がり、Webフォームが表示されます。

## 使い方

* 年、月をクリックし、編集したい年月を選択します。
* 表中のセルを左クリックしていくと、睡眠時間や外出時間の入力ができます。
* 表中のセルを右クリックすると空欄になります。
* 入力が終わったら必ず「**保存**」 ボタンを押してください。
* 終了する場合、起動しているコマンドプロンプトを閉じてください。サーバーが終了します。

## 印刷

* 印刷用紙に収まらない場合は倍率を縮小してください。
* 表中の灰色部分（外出時間など）が表示されない場合は、背景のグラフィックを印刷する設定にしてください。

Google chromeでの印刷方法を紹介します。

* 右上の「…」から印刷を選択します。

![](./img/c1.PNG)

* 「詳細設定」クリックします。

![](./img/c2.PNG)

* 「**倍率**」を調整（**66%**）し、「**背景のグラフィック**」にチェックを入れます。

![](./img/c3.PNG)

## エラー時の対処

* 保存できない場合は、コマンドプロンプトが起動しているか確認してください。
* サーバーが起動できない場合は、ポート番号3000が競合していないか確認してください。
  * Webフォームが使うポート番号を変更する場合は、 **server.js** の66行目を修正してください。
